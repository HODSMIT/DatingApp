import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/service/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../Core/service/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule,RouterLink,RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected accountservice = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected creds:any
  = {}
  protected loggedIn = signal(false)
  
  login()
  {
    this.accountservice.login(this.creds).subscribe({
      next: () => {
        //console.log(result);
        this.router.navigateByUrl('/members');
        this.toast.success('Logged In Successfully')
         this.creds = {};
      },
      error: error => { 
        console.log("Login failed", error);
          this.toast.error(error.error.message)        
      } 
    });
  }
  logout()
  {
    this.accountservice.logout();
    this.router.navigateByUrl('/');
  }

}
