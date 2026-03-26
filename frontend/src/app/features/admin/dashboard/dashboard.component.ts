import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, SkeletonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard de Estadísticas</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Users -->
        <p-card styleClass="shadow-lg border-t-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 font-semibold mb-1">Total Usuarios</p>
              <h2 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                <ng-container *ngIf="isLoading(); else showTotalUsers">
                  <p-skeleton width="4rem" height="3rem"></p-skeleton>
                </ng-container>
                <ng-template #showTotalUsers>{{ stats()?.totalUsers || 0 }}</ng-template>
              </h2>
            </div>
            <div class="bg-blue-100 p-3 rounded-full text-blue-600">
              <i class="pi pi-users text-2xl"></i>
            </div>
          </div>
        </p-card>

        <!-- New Users this month -->
        <p-card styleClass="shadow-lg border-t-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 font-semibold mb-1">Nuevos este Mes</p>
              <h2 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                <ng-container *ngIf="isLoading(); else showNewUsers">
                  <p-skeleton width="4rem" height="3rem"></p-skeleton>
                </ng-container>
                <ng-template #showNewUsers>{{ stats()?.newUsersThisMonth || 0 }}</ng-template>
              </h2>
            </div>
            <div class="bg-green-100 p-3 rounded-full text-green-600">
              <i class="pi pi-user-plus text-2xl"></i>
            </div>
          </div>
        </p-card>

        <!-- Media Items -->
        <p-card styleClass="shadow-lg border-t-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 font-semibold mb-1">Items Multimedia</p>
              <h2 class="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                <ng-container *ngIf="isLoading(); else showMedia">
                  <p-skeleton width="4rem" height="3rem"></p-skeleton>
                </ng-container>
                <ng-template #showMedia>{{ stats()?.totalMediaItems || 0 }}</ng-template>
              </h2>
            </div>
            <div class="bg-purple-100 p-3 rounded-full text-purple-600">
              <i class="pi pi-play text-2xl"></i>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  
  stats = signal<any>(null);
  isLoading = signal(true);

  async ngOnInit() {
    try {
      this.isLoading.set(true);
      const data = await this.adminService.getStats();
      this.stats.set(data);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
