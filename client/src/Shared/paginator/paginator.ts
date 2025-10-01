import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  pageNumber = model(1);
  locapageNumber = model(1);
  pagesize = model(10);
  totalCount = input(0);
  totalPages = input(0);
  pageSizeOptions = input([5,10,20,50])
  
  pageChange = output<{pageNumber:number , pagesize : number}>();


  lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pagesize(),this.totalCount())
  })

  onPageChange(newPage?: number, pagesize? : EventTarget | null)
  {
    if(newPage){
      this.pageNumber.set(newPage);
    }

    if(pagesize){
      const size = Number ((pagesize as HTMLSelectElement).value)
      this.pagesize.set(size);
    }

    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pagesize: this.pagesize()
    })

  }

}
