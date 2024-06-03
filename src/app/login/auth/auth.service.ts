// auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminUsers: string[] = ['admin', 'Javi1', 'Prueba', 'ruben27']; // Lista de usuarios admin
  private userRole: string | null = null; // Rol del usuario actual

  constructor(private router: Router) {
    this.userRole = localStorage.getItem('userRole'); // Obtiene el rol del usuario del localStorage
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.userRole !== null;
  }

  // Verifica si el usuario tiene el rol especificado
  hasRole(role: string): boolean {
    return this.userRole === role;
  }

  // Método de login que verifica si el usuario es admin
  login(userName: string, password: string): boolean {
    if (this.adminUsers.includes(userName)) {
      this.userRole = 'admin';
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', userName);
      return true;
    }
    return false;
  }

  // Método de logout que elimina el rol y nombre del usuario del localStorage
  logout(): void {
    this.userRole = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
