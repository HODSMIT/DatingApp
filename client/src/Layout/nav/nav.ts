import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/service/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../Core/service/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../Core/service/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule,RouterLink,RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {
  
  protected accountservice = inject(AccountService);
  protected busyservice = inject(BusyService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected creds:any
  = {}
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  protected loggedIn = signal(false)
  

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme',this.selectedTheme());
  }
  handleSelectTheme(theme: string){

    this.selectedTheme.set(theme);
    localStorage.setItem('theme',theme);
    document.documentElement.setAttribute('data-theme',theme);
    const elem = document.activeElement as HTMLDivElement;
    if(elem){

      elem.blur();

    }

  }
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
