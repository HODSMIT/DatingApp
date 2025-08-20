import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyrequestCount = signal(0);

  busy(){
    this.busyrequestCount.update(current => current + 1);
  }

  idle(){
    this.busyrequestCount.update(current => Math.max(0,current - 1));
  }
}
