import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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
}
