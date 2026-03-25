import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: '../login/login.component.scss' // Compartir estilos glassmorphism
})
export class VerifyEmailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  readonly isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  cooldown = signal(0);
  private interval: any;

  verifyForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.length === 6]]
  });

  ngOnInit() {
    this.email = localStorage.getItem('verify_email') || '';
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  async verify() {
    if (this.verifyForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await this.auth.verifyEmail(this.email, this.verifyForm.value.code);
      localStorage.removeItem('verify_email');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Código invalido o expirado.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async resendCode() {
    if (this.cooldown() > 0) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      // Assuming resend endpoint is added to authService
      await this.auth.resendVerification(this.email);
      this.successMessage.set('Código reenviado con éxito.');
      this.startCooldown();
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Error al reenviar el correo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private startCooldown() {
    this.cooldown.set(60);
    this.interval = setInterval(() => {
      this.cooldown.update(c => Math.max(0, c - 1));
      if (this.cooldown() === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }
}
