import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-test-error',
  imports: [],
  templateUrl: './test-error.html',
  styleUrl: './test-error.css'
})
export class TestError {
   private http = inject(HttpClient);
   baseUrl = "https://localhost:5001/api/";
   validationErrors =signal<string[]>([]);
   get404Error()
   {
     this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: respone => console.log(respone),
      error : error => console.log(error)
     })
   };
   get400Error()
   {
     this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: respone => console.log(respone),
      error : error => console.log(error)
     })
   };

   get500Error()
   {
     this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: respone => console.log(respone),
      error : error => console.log(error)
     })
   };
   get401Error()
   {
     this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: respone => console.log(respone),
      error : error => console.log(error)
     })
   };
   get400ValidationError()
   {
     this.http.post(this.baseUrl + 'account/register',{}).subscribe({
      next: respone => console.log(respone),
      error : error => {
        console.log(error);
        this.validationErrors.set(error)}
     })
   };
}
