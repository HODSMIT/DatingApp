import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../../Core/service/admin-service';
import { User } from '../../../app/types/user';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  @ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
  private adminuser = inject(AdminService)
  protected user = signal<User[]>([]);
  protected availableroles = ['Member','Moderator','Admin'];
  protected selectedUser: User | null = null; 


  ngOnInit(): void {
    this.getUserWithRoles();
    
  }

  getUserWithRoles(){
    this.adminuser.getUserWithRoles().subscribe({
      next: users => this.user.set(users)
    })
  }

  openRolesModal(user : User){
    this.selectedUser = user;
    this.rolesModal.nativeElement.showModal();
      
  }

  toggleRole(event: Event , role: string)
  {
    if(!this.selectedUser){
      return;
    }
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked) {
      this.selectedUser.roles.push(role);
    }
    else
    {
      this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role);
    }
  }

  updateRoles(){
    if(!this.selectedUser){
      return;
    }

    this.adminuser.updateUserRoles(this.selectedUser.id,this.selectedUser.roles).subscribe({
      next: updateRoles => {this.user.update(user => user.map(u => {
        if(u.id === this.selectedUser?.id)
        
          u.roles = updateRoles;
          return u;
        
      }));
      this.rolesModal.nativeElement.close();

      },
      error: error => console.log('failed To Update roles',error)
    })
  }

}
