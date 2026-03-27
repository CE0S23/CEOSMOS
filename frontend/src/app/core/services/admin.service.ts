import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(): Promise<AdminUser[]> {
    return firstValueFrom(this.http.get<AdminUser[]>(`${this.apiUrl}/users`));
  }

  deleteUser(id: string): Promise<{ message: string }> {
    return firstValueFrom(this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`));
  }

  changeRole(id: string, role: 'USER' | 'ADMIN'): Promise<{ id: string; email: string; role: string }> {
    return firstValueFrom(
      this.http.patch<{ id: string; email: string; role: string }>(`${this.apiUrl}/users/${id}/role`, { role }),
    );
  }

  updateUser(id: string, data: { email?: string; username?: string }): Promise<{ id: string; email: string; username: string; role: string }> {
    return firstValueFrom(
      this.http.patch<{ id: string; email: string; username: string; role: string }>(`${this.apiUrl}/users/${id}`, data),
    );
  }
}
