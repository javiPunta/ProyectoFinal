import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServicioService } from '../servicio.service';
import { Usuario } from '../model/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoggedIn: boolean = false;
  newloginForm!: FormGroup;
  newlogin!: Usuario;
  fallo: boolean = false;

  constructor(private fb: FormBuilder, private servicioService: ServicioService, private cookieService: CookieService, private router: Router) {
    this.newloginForm = this.fb.group({
      nombre_user: ['', [Validators.required]],
      contrasenia: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.newlogin = this.newloginForm.value;
    this.servicioService.login(this.newlogin).subscribe((data) => {
      if (data && data.length > 0) {
        const usuario = data[0];
        if (usuario && usuario.nombre_user) {
          const currentDate = new Date();
          const expirationDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          );
          this.cookieService.set('session', usuario.nombre_user, expirationDate, '/', 'localhost', false, "Lax");
          this.isLoggedIn = true;
          Swal.fire({
            title: 'Login Exitoso',
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigateByUrl('principal');
          });
        } else {
          this.fallo = true;
          console.error('La respuesta del servidor no contiene el campo nombre_user.');
        }
      } else {
        this.fallo = true;
        Swal.fire({
          title: 'Error',
          text: 'Usuario o contraseña incorrectos.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }, (error) => {
      this.fallo = true;
      console.error('Error al realizar la petición:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al realizar la petición. Inténtelo de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  getNombreUserPlaceholder() {
    return 'Introduce tu nombre de usuario';
  }

  get nombre_user() {
    return this.newloginForm.get('nombre_user');
  }

  get contrasenia() {
    return this.newloginForm.get('contrasenia');
  }

  goBack() {
    this.router.navigate(['/registro-user']);
  }

  goHome() {
    this.router.navigate(['/principal']);
  }
}
