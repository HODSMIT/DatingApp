import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { editablemember, Member } from '../../../app/types/Member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../Core/service/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../Core/service/toast-service';
import { AccountService } from '../../../Core/service/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe,FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit,OnDestroy{
  
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload',['$event']) notify($event:BeforeUnloadEvent){
    if(this.editForm?.dirty){
      $event.preventDefault();
    }
  }
  private accountserive = inject(AccountService)
  protected memberservice = inject(MemberService);
  private toast = inject(ToastService);
  //private route = inject(ActivatedRoute);
  //protected member = signal<Member | undefined>(undefined); 
  protected editablemember: editablemember = {displayName:'',description:'',city:'',country:''};

  ngOnInit(): void {
    // this.route.parent?.data.subscribe(data =>{
    //   this.member.set(data['member']);
    // })
    
        this.editablemember = {
      displayName:this.memberservice.member()?.displayName || '',
      description: this.memberservice.member()?.description || '',
      city: this.memberservice.member()?.city || '',
      country: this.memberservice.member()?.country || '',
    }
  }

  upadateProfile(){
    if(!this.memberservice.member()){
      return;
    }
    const updatedMember = {...this.memberservice.member(), ...this.editablemember}
    //console.log(updatedMember);
    this.memberservice.updateMember(this.editablemember).subscribe({
      next:()=>{
          const CurrentUser = this.accountserive.CurrentUser();
          if(CurrentUser && updatedMember.displayName !== CurrentUser?.displayName){
            CurrentUser.displayName = updatedMember.displayName;
            this.accountserive.setCurrentUser(CurrentUser)

          }
          this.toast.success('Profile updated SuccessFully');
          this.memberservice.editmode.set(false);
          this.memberservice.member.set(updatedMember as Member );
          this.editForm?.reset(updatedMember);
      }
    })
  }
  ngOnDestroy(): void {
    if(this.memberservice.editmode()){
      this.memberservice.editmode.set(false);

    }
  }

}
