// login.component.ts

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
  isLoggedIn: boolean = false; // Indicador de estado de sesión
  newloginForm!: FormGroup; // Formulario de login
  newlogin!: Usuario; // Datos del usuario
  fallo: boolean = false; // Indicador de fallo en login

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private cookieService: CookieService,
    private router: Router
  ) {
    // Inicialización del formulario con validaciones
    this.newloginForm = this.fb.group({
      nombre_user: ['', [Validators.required]],
      contrasenia: ['', [Validators.required]],
    });
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    this.newlogin = this.newloginForm.value; // Asigna los valores del formulario a `newlogin`
    this.servicioService.login(this.newlogin).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const usuario = data[0];
          if (usuario && usuario.nombre_user) {
            const currentDate = new Date();
            const expirationDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() + 1
            );
            // Establece la cookie de sesión
            this.cookieService.set('session', usuario.nombre_user, expirationDate, '/', 'localhost', false, "Lax");
            this.isLoggedIn = true;
            // Muestra una alerta de éxito
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
          // Muestra una alerta de error
          Swal.fire({
            title: 'Error',
            text: 'Usuario o contraseña incorrectos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      (error) => {
        this.fallo = true;
        console.error('Error al realizar la petición:', error);
        // Muestra una alerta de error en caso de fallo en la petición
        Swal.fire({
          title: 'Error',
          text: 'Error al realizar la petición. Inténtelo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  // Método para obtener el placeholder del campo `nombre_user`
  getNombreUserPlaceholder() {
    return 'Introduce tu nombre de usuario';
  }

  // Getters para los controles del formulario
  get nombre_user() {
    return this.newloginForm.get('nombre_user');
  }

  get contrasenia() {
    return this.newloginForm.get('contrasenia');
  }

  // Método para navegar al formulario de registro
  goBack() {
    this.router.navigate(['/registro-user']);
  }

  // Método para navegar a la página principal
  goHome() {
    this.router.navigate(['/principal']);
  }
}
