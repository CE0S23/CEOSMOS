import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/layout/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <app-navbar />
    <router-outlet />
    <p-toast></p-toast>
    <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `],
})
export class AppComponent {}
