import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../app/types/Member';
import { AgePipe } from '../../../Core/pipes/age-pipe';
import { AccountService } from '../../../Core/service/account-service';
import { MemberService } from '../../../Core/service/member-service';
import { PresenceService } from '../../../Core/service/presence-service';
import { LikesService } from '../../../Core/service/likes-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit{
  
  protected memberservice = inject(MemberService);
  private accountService = inject(AccountService);
  protected presenceService = inject(PresenceService); 
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected likeservice = inject(LikesService);
  //protected member = signal<Member | undefined> (undefined);
  protected title = signal<string | undefined>('Profile');
  private routeId = signal<string | null>(null);
  protected isCurrentUser = computed(() => {
    return this.accountService.CurrentUser()?.id === this.routeId(); 
  });

  protected hasLiked = computed(() => this.likeservice.likeIds().includes(this.routeId()!));

  constructor(){
    this.route.paramMap.subscribe(params => {
      this.routeId.set(params.get('id'));
    })
  }

  ngOnInit(): void {
    // this.route.data.subscribe({
    //   next: data => this.member.set(data['member'])
    // })
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }

  // loadMember()
  // {
  //   const id =this.route.snapshot.paramMap.get('id');
  //   if(!id)
  //   {
  //     return;
  //   }
  //   return this.memberservice.getMember(id); 
  // }

}
