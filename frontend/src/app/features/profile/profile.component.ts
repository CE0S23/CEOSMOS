import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { startRegistration } from '@simplewebauthn/browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly messageService = inject(MessageService);

  readonly isChangingPassword = signal(false);
  readonly isLinkingPasskey = signal(false);
  readonly passkeyAvailable = signal(false);

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      Validators.minLength(8)
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  ngOnInit() {
    this.auth.checkPlatformAuthenticator().then(ok => this.passkeyAvailable.set(ok));
  }

  async changePassword() {
    if (this.passwordForm.invalid) return;

    this.isChangingPassword.set(true);
    try {
      await this.auth.changePassword(
        this.passwordForm.value.currentPassword,
        this.passwordForm.value.newPassword
      );
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña cambiada exitosamente' });
      this.passwordForm.reset();
    } catch (err: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al cambiar contraseña' });
    } finally {
      this.isChangingPassword.set(false);
    }
  }

  async linkPasskey() {
    if (!this.passkeyAvailable()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Tu dispositivo no soporta Passkeys o WebAuthn' });
      return;
    }

    this.isLinkingPasskey.set(true);
    try {
      // 1. Opciones
      const options = await this.auth.webAuthnRegisterOptions();
      // 2. Browser
      const authResp = await startRegistration(options);
      // 3. Verify
      await this.auth.webAuthnRegisterVerify({ email: this.auth.user()?.email, challenge: options.challenge, response: authResp });
      
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Huella digital vinculada correctamente' });
    } catch (err: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message || 'No se pudo vincular la passkey' });
    } finally {
      this.isLinkingPasskey.set(false);
    }
  }
}
