import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminUsers: string[] = ['admin', 'Javi1', 'Prueba', 'ruben27'];
  private userRole: string | null = null;

  constructor(private router: Router) {
    this.userRole = localStorage.getItem('userRole');
  }

  isAuthenticated(): boolean {
    return this.userRole !== null;
  }

  hasRole(role: string): boolean {
    return this.userRole === role;
  }

  login(userName: string, password: string): boolean {
    if (this.adminUsers.includes(userName)) {
      this.userRole = 'admin';
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', userName);
      return true;
    }
    return false;
  }

  logout(): void {
    this.userRole = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
