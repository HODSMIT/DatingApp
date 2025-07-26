import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from "../Layout/nav/nav";
import { AccountService } from '../Core/service/account-service';
import { Home } from "../features/home/home";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Nav, Home], // Add CommonModule and HttpClientModule if needed
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected accountService = inject(AccountService);

  private http = inject(HttpClient);

  protected readonly title = 'Dating App';

  private readonly membersSignal = signal<any[]>([]);

  get membersList() {
    return this.membersSignal();
  }

  setCurrentUser()
  {
    const userString = localStorage.getItem('user');
    if(!userString)
      {
        return;
      } 
      const user = JSON.parse(userString);
      this.accountService.CurrentUser.set(user);
  }

  async ngOnInit() {
    try {
      const members = await this.getMembers();
      this.membersSignal.set(members);
      this.setCurrentUser();
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  }

  async getMembers(): Promise<any[]> {
    try {
      return await lastValueFrom(this.http.get<any[]>('https://localhost:5001/api/members'));
    } catch (error) {
      console.error('Error fetching members:', error);
      return []; // Return an empty array so UI can handle it
    }
  }
}
