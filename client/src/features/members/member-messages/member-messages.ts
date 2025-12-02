import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../Core/service/message-service';
import { MemberService } from '../../../Core/service/member-service';
import { Message } from '../../../app/types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../Core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PresenceService } from '../../../Core/service/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe,TimeAgoPipe,FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef
  protected messageService = inject(MessageService);
  private memberService = inject(MemberService);
  protected presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  protected messageContent = '';

  constructor(){
    effect(() => {
      const curreentMessages = this.messageService.messageThread();
      if(curreentMessages.length > 0)
      {
          this.scrollToBottom();
      }
    })
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params => {
        const OtherUserId = params.get('id');
        if(!OtherUserId)
        {
          throw new Error('Cannot connect to hub');
        }
        this.messageService.createHubConnection(OtherUserId);
      }
    });
    
  }

  // loadmessages(){
  //   const memberId = this.memberService.member()?.id;
  //   if(memberId){
  //     this.messageService.getMessageThread(memberId).subscribe({
  //       next : messages => this.messages.set(messages.map(message => ({
  //         ...message,
  //         currentUserSender: message.senderId !== memberId
  //       })))
  //     })
  //   }
  // }

  sendMessage() {
  const recipientId = this.memberService.member()?.id;
  if (!recipientId) return;

  this.messageService.sendMessage(recipientId, this.messageContent)?.then(() =>{
    this.messageContent = '';
  })
}


scrollToBottom(){
  setTimeout(() =>{
    if(this.messageEndRef)
    {
      this.messageEndRef.nativeElement.scrollIntoView({
        behavior: 'smooth'
      })
    }

  })
   
}

}
