import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('menuAnimation', [
      state('open', style({
        transform: 'rotate(0deg)'
      })),
      state('close', style({
        transform: 'rotate(180deg)'
      })),
      transition('open <=> close', animate('0.3s ease-in-out'))
    ])
  ]
})

export class DashboardComponent implements OnInit {
  loading: boolean = true; 

  ngOnInit(): void {
        // Simulate API calls with setTimeout
        setTimeout(() => {
          // Assuming API calls are completed here
          this.loading = false;
        }, 2000); // Adjust the timeout as per your actual API response time
      }
  
  @ViewChild('drawer')
  drawer!: MatDrawer;
  sidebarOpen: boolean = true;

  toggleSidebar() {
    this.drawer.toggle();
    this.sidebarOpen = !this.sidebarOpen;
}
}