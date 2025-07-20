import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], // Add CommonModule and HttpClientModule if needed
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  private http = inject(HttpClient);

  protected readonly title = 'Dating App';

  private readonly membersSignal = signal<any[]>([]);

  get membersList() {
    return this.membersSignal();
  }

  async ngOnInit() {
    try {
      const members = await this.getMembers();
      this.membersSignal.set(members);
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
