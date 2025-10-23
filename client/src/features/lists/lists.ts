import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../Core/service/likes-service';
import { Member } from '../../app/types/Member';
import { MemberCard } from "../members/member-card/member-card";
import { PaginatedResult } from '../../app/types/pagination';
import { Paginator } from "../../Shared/paginator/paginator";

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  
  private likeService = inject(LikesService);
  protected paginatedResult = signal<PaginatedResult<Member>| null>(null);
  protected members = signal<Member[]>([]);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pagesize = 5;

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
      this.pageNumber = 1;
      this.loadLikes();
    }

  }
  loadLikes(){
    this.likeService.getLikes(this.predicate,this.pageNumber,this.pagesize).subscribe({
      next: members => this.members.set(members)
    })
  }

  OnPageChange(event: {pageNumber:number,pagesize:number}){
    this.pagesize = event.pagesize;
    this.pageNumber = event.pageNumber;
    this.loadLikes();

  }

}
