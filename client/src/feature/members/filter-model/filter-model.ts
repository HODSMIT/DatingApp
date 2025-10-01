import { Component, ElementRef, output, ViewChild } from '@angular/core';
import { MemberParams } from '../../../app/types/Member';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-filter-model',
  imports: [FormsModule],
  templateUrl: './filter-model.html',
  styleUrl: './filter-model.css'
})
export class FilterModel {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>
  closeModal = output();
  submitData = output<MemberParams>();
  membersParam = new MemberParams(); 
  open()
  {
    this.modalRef.nativeElement.showModal();
  }

  close()
  {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  submit(){
    this.submitData.emit(this.membersParam);
    this.close();
  }

  onMinAgeChange(){
    if(this.membersParam.minAge < 18)
      {
        this.membersParam.minAge = 18;
      }
  }

  onMaxAgeChange(){
    if (this.membersParam.maxAge < this.membersParam.minAge){
      this.membersParam.maxAge = this.membersParam.minAge
    }
  }

}