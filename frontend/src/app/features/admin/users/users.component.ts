import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, TableModule, SkeletonModule, InputTextModule, ButtonModule, TagModule, ConfirmDialogModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Usuarios</h1>
      
      <div class="card shadow-md rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <p-table
          #dt
          [value]="users()"
          [paginator]="true"
          [rows]="10"
          [globalFilterFields]="['username', 'email']"
          [loading]="isLoading()"
          responsiveLayout="stack"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
          [rowsPerPageOptions]="[10, 25, 50]"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-between items-center px-2 py-3">
              <span class="p-input-icon-left w-full md:w-auto">
                <i class="pi pi-search ml-2"></i>
                <input
                  pInputText
                  type="text"
                  (input)="dt.filterGlobal($any($event.target).value, 'contains')"
                  placeholder="Buscar usuario o correo..."
                  class="p-2 w-full md:w-80 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th>Avatar</th>
              <th pSortableColumn="username">Nombre <p-sortIcon field="username"></p-sortIcon></th>
              <th pSortableColumn="email">Correo <p-sortIcon field="email"></p-sortIcon></th>
              <th pSortableColumn="role">Rol <p-sortIcon field="role"></p-sortIcon></th>
              <th pSortableColumn="createdAt">Fecha Registro <p-sortIcon field="createdAt"></p-sortIcon></th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-usr>
            <tr>
              <td>
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold uppercase">
                  {{ usr.username.charAt(0) }}
                </div>
              </td>
              <td class="font-semibold text-gray-800 dark:text-gray-200">{{ usr.username }}</td>
              <td class="text-gray-600 dark:text-gray-400">{{ usr.email }}</td>
              <td>
                <p-tag [severity]="usr.role === 'ADMIN' ? 'danger' : 'success'" [value]="usr.role"></p-tag>
              </td>
              <td class="text-gray-600 dark:text-gray-400">{{ usr.createdAt | date: 'mediumDate' }}</td>
              <td><p-tag severity="success" value="Activo"></p-tag></td>
              <td>
                <div class="flex space-x-2">
                  <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-text p-button-info" pTooltip="Ver detalle"></p-button>
                  <p-button icon="pi pi-shield" styleClass="p-button-rounded p-button-text p-button-warning" pTooltip="Cambiar rol" (onClick)="confirmRoleChange(usr)"></p-button>
                  <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-text p-button-danger" pTooltip="Desactivar cuenta" (onClick)="confirmDelete(usr)"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="loadingbody">
            <tr *ngFor="let _ of [1,2,3,4,5]">
              <td><p-skeleton shape="circle" size="3rem" styleClass="mb-2"></p-skeleton></td>
              <td><p-skeleton width="100%"></p-skeleton></td>
              <td><p-skeleton width="100%"></p-skeleton></td>
              <td><p-skeleton width="100%"></p-skeleton></td>
              <td><p-skeleton width="100%"></p-skeleton></td>
              <td><p-skeleton width="100%"></p-skeleton></td>
              <td><p-skeleton width="100%"></p-skeleton></td>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center p-4">No se encontraron usuarios.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  
  users = signal<any[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    try {
      this.isLoading.set(true);
      const data = await this.adminService.getUsers();
      this.users.set(data);
    } catch (e) {
      console.error(e);
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Fallo al cargar usuarios'});
    } finally {
      this.isLoading.set(false);
    }
  }

  confirmDelete(usr: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas desactivar la cuenta de ${usr.username}?`,
      header: 'Confirmar Destrucción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Operación Exitosa', detail: 'Usuario desactivado' });
      }
    });
  }

  confirmRoleChange(usr: any) {
    this.confirmationService.confirm({
      message: `¿Deseas cambiar el rol de ${usr.username}?`,
      header: 'Confirmar Cambio de Rol',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Proceder',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Operación Exitosa', detail: 'El rol será modificado' });
      }
    });
  }
}
