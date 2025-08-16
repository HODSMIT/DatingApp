import { Component, inject } from '@angular/core';
import { MemberService } from '../../../Core/service/member-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../../app/types/Member';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos {

  private memberservice = inject(MemberService) 
  private route = inject(ActivatedRoute)


  protected photos$? : Observable<Photo[]>

  constructor(){
    const memberid = this.route.parent?.snapshot.paramMap.get('id');
    if (memberid)
    {
       this.photos$ = this.memberservice.getMemberPhotos(memberid); 
    }
  }

  get photoMocks(){
    return Array.from({length: 20},(_, i ) => ({
      url:'/user.png'
  }))

  }

}
