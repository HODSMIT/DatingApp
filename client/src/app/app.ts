import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Nav } from "../Layout/nav/nav";
import { Router, RouterOutlet } from "@angular/router";
import { ConfirmDialog } from "../Shared/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Nav, RouterOutlet, ConfirmDialog], // Add CommonModule and HttpClientModule if needed
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected router = inject(Router);

}
