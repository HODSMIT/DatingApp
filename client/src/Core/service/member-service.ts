import { HttpClient, HttpParams} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { editablemember, Member, MemberParams, Photo } from '../../app/types/Member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../app/types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
 private http = inject(HttpClient);
 private baseUrl = environment.apiUrl;
 editmode = signal(false); 
 member = signal<Member | null>(null);

 getMembers(MemberParams: MemberParams)
 {
  let params =  new HttpParams();
  params = params.append('pageNumber',MemberParams.pageNumber);
  params = params.append('pageSize',MemberParams.pageSize);
  params = params.append('minAge',MemberParams.minAge);
  params = params.append('maxAge',MemberParams.maxAge);
  params = params.append('orderBy',MemberParams.orderBy);
  
  if(MemberParams.gender)
  {
    params = params.append('gender', MemberParams.gender)
  }
  return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'members',{params});
 }

 getMember(id: string)
 {
   return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
    tap(member => {
      this.member.set(member)
    })
   );
 }

 getMemberPhotos(id: string)
 {
  return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos')
 }

 updateMember(member : editablemember){
  return this.http.put(this.baseUrl + 'members', member)

 }

 uploadPhoto(file : File){
  const formdata = new FormData();
  formdata.append('file',file);
  return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formdata);
 }

 setMainPhoto(photo : Photo){
  return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.id, {})
 }


 deletePhoto(photoId : number){
  return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId)

 }
}
