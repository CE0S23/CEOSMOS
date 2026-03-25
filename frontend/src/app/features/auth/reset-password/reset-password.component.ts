import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    PasswordModule,
    ProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: '../login/login.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  token = '';

  resetForm: FormGroup = this.fb.group({
    password: ['', [
      Validators.required, 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      Validators.minLength(8)
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.errorMessage.set('Token no encontrado. Solicita un nuevo enlace.');
      }
    });
  }

  async resetPassword() {
    if (this.resetForm.invalid || !this.token) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await this.auth.resetPassword(this.token, this.resetForm.value.password);
      this.successMessage.set('Contraseña actualizada correctamente.');
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
