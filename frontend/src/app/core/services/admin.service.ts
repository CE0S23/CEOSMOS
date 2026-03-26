import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async getStats(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/admin/stats`));
  }

  async getUsers(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/admin/users`));
  }
}
