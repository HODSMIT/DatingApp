import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../app/types/pagination';
import { Message } from '../../app/types/message';
import { AccountService } from './account-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private hubConnection?: HubConnection;

  messageThread = signal<Message[]>([]);

  // --------------------------------------------------
  // 1. CREATE CONNECTION WITH AUTO-RECONNECT
  // --------------------------------------------------
  createHubConnection(otherUserId: string) {
    const currentUser = this.accountService.CurrentUser();
    if (!currentUser) return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'messages?userId=' + otherUserId, {
        accessTokenFactory: () => currentUser.token
      })
      .withAutomaticReconnect()
      .build();

    this.registerHubEvents(currentUser.id, otherUserId);
    this.startConnection();
  }

  // --------------------------------------------------
  // 2. SAFE START WITH RETRY LOGIC
  // --------------------------------------------------
  private async startConnection() {
    if (!this.hubConnection) return;

    try {
      await this.hubConnection.start();
      console.log("MessageHub Connected");
    } catch (error) {
      console.log("Connection failed. Retrying in 2s...", error);
      setTimeout(() => this.startConnection(), 2000);
    }
  }

  // --------------------------------------------------
  // 3. HANDLE HUB EVENTS
  // --------------------------------------------------
  private registerHubEvents(currentUserId: string, otherUserId: string) {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
      this.messageThread.set(
        messages.map(m => ({
          ...m,
          currentUserSender: m.senderId !== otherUserId
        }))
      );
    });

    this.hubConnection.on('NewMessage', (message: Message) => {
      message.currentUserSender = message.senderId === currentUserId;
      this.messageThread.update(messages => [...messages, message]);
    });

    this.hubConnection.onreconnecting(() => {
      console.log('MessageHub reconnecting...');
    });

    this.hubConnection.onreconnected(() => {
      console.log('MessageHub reconnected');
    });

    this.hubConnection.onclose(() => {
      console.log('MessageHub closed. Restarting...');
      this.startConnection();
    });
  }

  // --------------------------------------------------
  // 4. SAFE STOP CONNECTION
  // --------------------------------------------------
  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => console.log(err));
    }
  }

  // --------------------------------------------------
  // 5. FIXED sendMessage() – Always wait for connection
  // --------------------------------------------------
  async sendMessage(recipientId: string, content: string) {
    if (!this.hubConnection) return;

    // Ensure connection before invoking
    if (this.hubConnection.state !== HubConnectionState.Connected) {
      console.warn("Hub not connected — retrying start...");
      await this.startConnection();
    }

    return this.hubConnection
      .invoke<Message>('SendMessage', { recipientId, content })
      .catch(err => console.error("SendMessage error:", err));
  }

  // --------------------------------------------------
  // HTTP API calls (unchanged)
  // --------------------------------------------------
  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('container', container);

    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'message', { params });
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + memberId);
  }

  deleteMessage(id: string) {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}
