import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../app/types/user';
import { AccountService } from '../../../Core/service/account-service';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private accountService = inject(AccountService);
   cancelregister = output<boolean>();
 protected cred = {} as RegisterCreds;

 register()
 {
   //console.log(this.cred);
   
  this.accountService.register(this.cred).subscribe({
    next: (response) => {
      console.log(response);
      this.cancel();
    },
    error: (error) => console.log(error)
  });

 }

 cancel()
 {
  this.cancelregister.emit(false);
  console.log('cancelled!');
 }
}
