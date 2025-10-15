import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../Core/service/likes-service';
import { Member } from '../../app/types/Member';

@Component({
  selector: 'app-lists',
  imports: [],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  
  private likeService = inject(LikesService);
  protected members = signal<Member[]>([]);
  protected predicate = 'liked';

  tabs = [
    {label:'Liked',value :'liked'},
    {label:'Liked me',value :'likedBy'},
    {label:'Mutual',value :'mutual'},
  ]
  ngOnInit(): void {
    this.loadLikes();
  }
  
  setPredicate(predicate:string){
    if(this.predicate !== predicate){
      this.predicate = predicate;
      this.loadLikes();
    }

  }
  loadLikes(){
    this.likeService.getLikes(this.predicate).subscribe({
      next: members => this.members.set(members)
    })
  }

}
