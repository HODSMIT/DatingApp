import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../app/types/Member';
import { RouterLink } from '@angular/router';
import { AgePipe } from "../../../Core/pipes/age-pipe";
import { LikesService } from '../../../Core/service/likes-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css'
})
export class MemberCard {
  private likeService = inject(LikesService); 
  member = input.required<Member>();
  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));

  ToggleLike(event : Event){
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () =>{
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids => ids.filter(x => x! == this.member().id))
        }
        else
        {
          this.likeService.likeIds.update(ids => [...ids,this.member().id])
        }
      }
    })
  }
}
