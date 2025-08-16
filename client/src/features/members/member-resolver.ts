import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../Core/service/member-service';
import { inject } from '@angular/core';
import { Member } from '../../app/types/Member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router)
  const memberid = route.paramMap.get('id');
 
  if(!memberid)
  {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }
  return memberService.getMember(memberid);
};
