import { Component, inject, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../Core/service/member-service';
import { Observable } from 'rxjs';
import { Member, MemberParams } from '../../../app/types/Member';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../app/types/pagination';
import { Paginator } from "../../../Shared/paginator/paginator";
import { FilterModel } from '../../../feature/members/filter-model/filter-model';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModel],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
    @ViewChild('filterModal') modal! : FilterModel;
    private memberService = inject(MemberService);
    protected PaginatedMembers =  signal<PaginatedResult<Member> | null>(null);
    protected memberParam = new MemberParams();

    constructor(){
      this.loadMembers();
    }
  ngOnInit(): void {
    this.loadMembers();
  }

    loadMembers()
    {
      this.memberService.getMembers(this.memberParam).subscribe({
        next : result =>{
          console.log("Fetched members: ", result);
          this.PaginatedMembers.set(result)
        }
      });
    }
    OnPageChange(event : {pageNumber : number , pagesize : number}){
      this.memberParam.pageNumber = event.pageNumber; 
      this.memberParam.pageSize = event.pagesize;
      this.loadMembers()
    }

    openModal(){
      this.modal.open();
    }

    onClose() {
      console.log('Modal closed')
    }

    onFilterChange(data: MemberParams) {
      this.memberParam = data;
      //console.log('Modal submitted data: ',data)
    }

    resetFilter(){
      this.memberParam = new MemberParams();
      this.loadMembers();

    }
}
