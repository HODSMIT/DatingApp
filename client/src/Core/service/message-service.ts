import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../app/types/pagination';
import { Message } from '../../app/types/message';
import { AccountService } from './account-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { UpperCasePipe } from '@angular/common';

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

  createHubConnection(OtherUserId : string){
    const currentUser = this.accountService.CurrentUser();
    if(!currentUser)
    {
      return;
    }

    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'messages?userId=' + OtherUserId,{
      accessTokenFactory:() => currentUser.token
    })
    .withAutomaticReconnect()
    .build();
    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessageThread',(messages: Message[]) => {
      this.messageThread.set(messages.map(message => ({
          ...message,
          currentUserSender: message.senderId !== OtherUserId
        })))
    })
    this.hubConnection.on('NewMessage',(message: Message) => {message.currentUserSender = message.senderId == currentUser.id;
      this.messageThread.update(messages => [...messages,message])
    })

  }

  stopHubConnection(){
    if(this.hubConnection?.state == HubConnectionState.Connected)
    {
      this.hubConnection.stop().catch(error => console.log(error))

    }
  }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('container', container);

    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'message', {params});
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + memberId);
  }

  sendMessage(recipientId: string, content: string) {
    return this.hubConnection?.invoke<Message>('SendMessage', {recipientId, content})
  }

  deleteMessage(id: string) {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}
