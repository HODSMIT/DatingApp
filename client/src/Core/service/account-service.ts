import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../app/types/user';
import { retry, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';
import { PresenceService } from './presence-service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  private presenceService = inject(PresenceService);
  private likesService = inject(LikesService);
  CurrentUser = signal<User | null>(null)
  private baseUrl = environment.apiUrl;
  
  register(creds :RegisterCreds)
  {
      return this.http.post<User>(this.baseUrl + 'account/register',creds,
        {withCredentials: true}).pipe(
      tap(user => {
        if(user)
          {
            this.setCurrentUser(user)
            this.startTokenRefreshInterval();
          } 
      })  
      )
        
      
  }
  login(creds:LoginCreds)
  {
    return this.http.post<User>(this.baseUrl + 'account/login', creds ,{withCredentials:true}).pipe(
      tap(user => {
        if(user)
          {
            this.setCurrentUser(user)
            this.startTokenRefreshInterval();
          } 
      })
    )
  }

  refreshToken(){
    return this.http.post<User>(this.baseUrl + 'account/refresh-token',{},{withCredentials: true})
  }

  setCurrentUser(user: User)
  {
    user.roles = this.getRolesFromToken(user);
    //localStorage.setItem('user',JSON.stringify(user))
            this.CurrentUser.set(user)
            this.likesService.getLikeIds();
            if(this.presenceService.hubConnection?.state !== HubConnectionState.Connected){
              this.presenceService.createHubConnection(user);

            }

  }

  startTokenRefreshInterval(){
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token',{},{withCredentials: true}).subscribe({
        next: user => {
          this.setCurrentUser(user)
        },
        error: () => {
          this.logout()
        }
      })
    }, 5 * 60 * 1000)
  }
  logout()
  {
    //localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.CurrentUser.set(null);
    this.likesService.clearLikeIds();

  }


  private getRolesFromToken (user:User):string[]
  {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const  jsonPayload = JSON.parse(decoded);

    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]

  }
}
