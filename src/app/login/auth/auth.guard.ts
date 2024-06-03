// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Método que verifica si el usuario puede acceder a una ruta protegida
  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.hasRole('admin')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
