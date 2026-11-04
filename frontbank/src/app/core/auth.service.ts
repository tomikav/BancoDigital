import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserProfile } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  profile = signal<UserProfile | null>(this.loadProfile());
  mockMode = signal<boolean>(sessionStorage.getItem('mockMode') === 'true');

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null && this.profile() !== null;
  }

  login(user: string, password: string): Observable<UserProfile> {
    const token = btoa(user + ':' + password);
    const headers = new HttpHeaders({ Authorization: 'Basic ' + token });

    return this.http.post<UserProfile>('/auth/login', null, { headers }).pipe(
      tap((profile) => {
        sessionStorage.setItem('token', token);
        this.saveProfile(profile);
      }),
    );
  }

  updatePassword(newPassword: string) {
    const user = this.profile()?.user;
    if (user) {
      sessionStorage.setItem('token', btoa(user + ':' + newPassword));
    }
  }

  saveProfile(profile: UserProfile) {
    sessionStorage.setItem('profile', JSON.stringify(profile));
    this.profile.set(profile);
  }

  setMockMode(value: boolean) {
    this.mockMode.set(value);
    sessionStorage.setItem('mockMode', String(value));
  }

  logout(expired = false) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('profile');
    this.profile.set(null);
    if (expired) {
      this.router.navigate(['/login'], { queryParams: { expired: 'true' } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private loadProfile(): UserProfile | null {
    const data = sessionStorage.getItem('profile');
    return data ? JSON.parse(data) : null;
  }
}
