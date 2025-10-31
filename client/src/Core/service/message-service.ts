import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../app/types/pagination';
import { Message } from '../../app/types/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMessages(container: string, pageNumber: number, PageSize : number)
  {
     let params = new HttpParams();

     params = params.append('pageNumber',pageNumber);
     params = params.append('pageSize',pageNumber);
     params = params.append('Container',container);

     return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'message' , {params});
  }


  getMessageThread(memberId: string){
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + memberId);
  }


  sendMessage(recipientId: string, content: string) {
  return this.http.post<Message>(this.baseUrl + 'message', { recipientId, content });
  }

}
