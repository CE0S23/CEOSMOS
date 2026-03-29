import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { startRegistration } from '@simplewebauthn/browser';
import { AuthService } from '../../core/services/auth.service';
import { Session } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  sessions = signal<Session[]>([]);
  loadingSessions = signal(true);
  sessionsError = signal<string | null>(null);

  passkeyLoading = signal(false);
  passkeySuccess = signal<string | null>(null);
  passkeyError = signal<string | null>(null);

  get initials(): string {
    const name = this.auth.user()?.username ?? this.auth.user()?.name ?? '?';
    return name.slice(0, 2).toUpperCase();
  }

  async ngOnInit() {
    try {
      const data = await firstValueFrom(
        this.http.get<Session[]>(`${this.apiUrl}/users/me/sessions`)
      );
      this.sessions.set(data);
    } catch {
      this.sessionsError.set('No se pudieron cargar las sesiones.');
    } finally {
      this.loadingSessions.set(false);
    }
  }

  async registerPasskey(): Promise<void> {
    this.passkeySuccess.set(null);
    this.passkeyError.set(null);
    this.passkeyLoading.set(true);

    try {
      const email = this.auth.user()?.email;
      if (!email) throw new Error('No se encontró el email del usuario.');

      const options = await this.auth.webAuthnRegisterOptions(email);
      const registrationResponse = await startRegistration({ optionsJSON: options });
      await this.auth.webAuthnRegisterVerify({
        email,
        challenge: options.challenge,
        response: registrationResponse,
      });

      await this.auth.getMe();
      this.passkeySuccess.set('Huella digital registrada correctamente.');
    } catch (err: any) {
      if (err?.name === 'InvalidStateError') {
        this.passkeyError.set('Ya tienes una huella registrada en este dispositivo.');
      } else if (err?.name === 'NotAllowedError') {
        this.passkeyError.set('Registro cancelado por el usuario.');
      } else {
        this.passkeyError.set(err?.error?.message ?? err?.message ?? 'Error al registrar la huella.');
      }
    } finally {
      this.passkeyLoading.set(false);
    }
  }
}
