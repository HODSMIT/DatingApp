import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.post(`${this.basUrl}likes/${targetmemberId}`,{}).subscribe({
      next: () =>{
        if(this.likeIds().includes(targetmemberId)){
          this.likeIds.update(ids => ids.filter(x => x! == targetmemberId))
        }
        else
        {
          this.likeIds.update(ids => [...ids,targetmemberId])
        }
      }
    })
  }

  getLikes(predicate : string,pageNumber:number,pagesize:number)
  {
      let params = new HttpParams();
      params = params.append('pageNumber',pageNumber);
      params = params.append('pagesize',pagesize);
      params = params.append('predicate',predicate);
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
