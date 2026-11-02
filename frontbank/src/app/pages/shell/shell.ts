import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { BankApiService } from '../../core/bank-api.service';
import { CopPipe } from '../../core/cop.pipe';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CopPipe],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  auth = inject(AuthService);
  api = inject(BankApiService);

  menu = [
    { path: 'inicio', label: 'Inicio', icon: '⌂' },
    { path: 'depositar', label: 'Depositar', icon: '↓' },
    { path: 'retirar', label: 'Retirar', icon: '↑' },
    { path: 'perfil', label: 'Mis datos', icon: '◉' },
    { path: 'seguridad', label: 'Seguridad', icon: '⚿' },
  ];

  constructor() {
    this.api.getBalance().subscribe();
  }

  initials(): string {
    const p = this.auth.profile();
    if (!p) return '?';
    return (p.name.charAt(0) + p.lastName.charAt(0)).toUpperCase();
  }
}
