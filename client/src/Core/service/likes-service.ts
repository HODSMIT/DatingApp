import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../app/types/Member';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private  basUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<string[]>([]);

  toggleLike(targetmemberId: string)
  {
    return this.http.post(`${this.basUrl}likes/${targetmemberId}`,{});
  }

  getLikes(predicate : string)
  {
      return this.http.get<Member[]>(this.basUrl + 'likes?predicate=' + predicate);
  }


  getLikeIds(){
    return this.http.get<string[]>(this.basUrl + 'likes/list').subscribe({
      next:ids =>this.likeIds.set(ids)
    })
  }


  clearLikeIds(){
    this.likeIds.set([]);
  }

 
}
