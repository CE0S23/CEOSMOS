import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { AdminUser } from '../../core/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly auth = inject(AuthService);

  users = signal<AdminUser[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  editingId = signal<string | null>(null);
  editEmail = signal('');
  editUsername = signal('');
  saving = signal(false);

  async ngOnInit() {
    await this.loadUsers();
  }

  private async loadUsers() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const all = await this.adminService.getUsers();
      const myId = this.auth.user()?.id;
      this.users.set(all.filter(u => u.id !== myId));
    } catch {
      this.error.set('Error al cargar usuarios');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(user: AdminUser) {
    this.editingId.set(user.id);
    this.editEmail.set(user.email);
    this.editUsername.set(user.username);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  async saveEdit(userId: string) {
    this.saving.set(true);
    try {
      const updated = await this.adminService.updateUser(userId, {
        email: this.editEmail(),
        username: this.editUsername(),
      });
      this.users.update(list =>
        list.map(u => u.id === userId ? { ...u, email: updated.email, username: updated.username } : u),
      );
      this.editingId.set(null);
    } catch (err: any) {
      this.error.set(err?.error?.message ?? 'Error al guardar cambios');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleRole(user: AdminUser) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await this.adminService.changeRole(user.id, newRole);
      this.users.update(list =>
        list.map(u => u.id === user.id ? { ...u, role: newRole } : u),
      );
    } catch (err: any) {
      this.error.set(err?.error?.message ?? 'Error al cambiar rol');
    }
  }

  async deleteUser(user: AdminUser) {
    if (!confirm(`¿Eliminar usuario ${user.username}?`)) return;
    try {
      await this.adminService.deleteUser(user.id);
      this.users.update(list => list.filter(u => u.id !== user.id));
    } catch (err: any) {
      this.error.set(err?.error?.message ?? 'Error al eliminar usuario');
    }
  }
}
