import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../Core/service/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../app/types/Member';
import { AgePipe } from '../../../Core/pipes/age-pipe';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit{
  
  private memberservice = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected member = signal<Member | undefined> (undefined);
  protected title = signal<string | undefined>('Profile');

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member.set(data['member'])
    })
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
