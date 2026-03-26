import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 dark:bg-gray-900">
      <div class="text-center">
        <h1 class="text-9xl font-extrabold text-blue-600 dark:text-blue-500 tracking-widest">404</h1>
        <div class="bg-indigo-500 px-2 text-sm rounded rotate-12 absolute shadow uppercase">
          Perdido en el Espacio
        </div>
        
        <p class="text-2xl mt-8 font-semibold text-gray-800 dark:text-gray-100 mb-6">Oops! La página que buscas no existe.</p>
        
        <a routerLink="/home" class="inline-block mt-4">
          <p-button label="Volver al inicio" icon="pi pi-home" styleClass="p-button-outlined p-button-lg px-8 py-3"></p-button>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .rotate-12 {
      transform: rotate(12deg);
      top: 35%;
      margin-top:-20px;
    }
  `]
})
export class NotFoundComponent {}
