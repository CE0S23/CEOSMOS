import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelMenuModule],
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div class="w-64 bg-white dark:bg-gray-800 shadow-md p-4 hidden md:block border-r border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 px-4">Admin Panel</h2>
        <p-panelMenu [model]="items" [style]="{'width':'100%'}"></p-panelMenu>
      </div>
      <div class="flex-1 p-6 overflow-auto w-full">
        <div class="md:hidden mb-4">
          <p-panelMenu [model]="items" [style]="{'width':'100%'}"></p-panelMenu>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        command: () => this.router.navigate(['/admin/dashboard'])
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users',
        command: () => this.router.navigate(['/admin/users'])
      }
    ];
  }
}
