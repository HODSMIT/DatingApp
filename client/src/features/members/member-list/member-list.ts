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
    private updateParmas = new MemberParams();

    constructor(){
      const filters = localStorage.getItem('filters');
      if(filters){
        this.memberParam = JSON.parse(filters);
        this.updateParmas = JSON.parse(filters);
      }
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
      this.memberParam = {...data};
      console.log('Modal submitted data: ',data)
      this.updateParmas = {...data};
      this.loadMembers();
    }

    resetFilter(){
      this.memberParam = new MemberParams();
      this.updateParmas = new MemberParams();
      this.loadMembers();

    }

    get displayMessage(): string {
      const defaultParams = new MemberParams();

      const filters: string[] = [];

      if(this.updateParmas.gender){
        filters.push(this.updateParmas.gender + 's')
      }
      else
      {
        filters.push('Males, Females');
      }

      if(this.updateParmas.minAge != defaultParams.minAge ||  this.updateParmas.maxAge !== defaultParams.maxAge)
      {
        filters.push(` age ${this.updateParmas.minAge}~${this.updateParmas.maxAge}`)
      }

      filters.push(this.updateParmas.orderBy === 'lastActive' ? 'Recently active' : 'Newest members');

      return filters.length > 0 ? `Selected: ${filters.join('  | ')}` : 'All members'

    }
}
