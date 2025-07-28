import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Nav } from "../Layout/nav/nav";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Nav,RouterOutlet], // Add CommonModule and HttpClientModule if needed
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected router = inject(Router);

}
