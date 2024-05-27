import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario'; // Importa el modelo de Usuario
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa las herramientas de formularios reactivos
import { Observable } from 'rxjs'; // Importa Observable de RxJS
import { ServicioService } from '../servicio.service'; // Importa el servicio de datos
import { Router } from '@angular/router'; // Importa el router para navegación
import Swal from 'sweetalert2'; // Importa SweetAlert2 para notificaciones
import { CookieService } from 'ngx-cookie-service'; // Importa el servicio de cookies

@Component({
  selector: 'app-registro-user',
  templateUrl: './registro-user.component.html',
  styleUrls: ['./registro-user.component.scss']
})
export class RegistroUserComponent implements OnInit {
  newusuarioForm!: FormGroup; // Declaración del formulario reactivo
  public message: string = ''; // Mensaje informativo
  public clasec: string = ''; // Clase CSS para mensajes de error
  public clases: string = 'text-info'; // Clase CSS para mensajes informativos
  resp: any; // Variable para la respuesta del servicio
  actuales$!: Observable<Usuario[]>; // Observable para la lista de usuarios actuales

  // Inicializa un nuevo usuario
  newusuario: Usuario = {
    nombre_user: '',
    nombre_compl_user: '',
    contrasenia: '',
    email: ''
  };

  constructor(
    private servicioService: ServicioService, // Inyecta el servicio de datos
    private fb: FormBuilder, // Inyecta el form builder
    private router: Router, // Inyecta el router
    private cookieService: CookieService // Inyecta el servicio de cookies
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con validaciones
    this.newusuarioForm = this.fb.group({
      nombre_user: ['', Validators.required],
      nombre_compl_user: ['', Validators.required],
      contrasenia: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  entradausuario() {
    if (this.newusuarioForm.invalid) {
      // Muestra un mensaje de error si el formulario es inválido
      Swal.fire({
        icon: 'error',
        title: 'Errores en el formulario',
        text: 'Por favor corrige los errores antes de continuar.',
      });
    } else {
      // Obtiene los valores del formulario
      const newusuario = this.newusuarioForm.value;
      // Llama al servicio para registrar el nuevo usuario
      this.servicioService.getDatosRegistro(newusuario).subscribe({
        next: (resp) => {
          this.resp = resp;
          console.log('Respuesta del servicio:', resp);
          if (resp.msg) {
            // Muestra un mensaje de éxito si el registro es exitoso
            Swal.fire({
              icon: 'success',
              title: 'Registro Exitoso',
              text: 'El usuario ha sido registrado correctamente.',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              // Navega al componente de login
              this.router.navigate(['/principal']);
            });
          } else if (resp.error) {
            // Muestra un mensaje de error si hay errores en la respuesta
            const errorMessages = this.getErrorMessage(resp.error);
            Swal.fire({
              icon: 'error',
              title: 'Error en el registro',
              html: errorMessages
            });
          }
        },
        error: (err) => {
          console.log('Error completo en la solicitud:', JSON.stringify(err));
          // Muestra un mensaje de error si hay un error en la solicitud
          const errorMessages = this.getErrorMessage(err.error);
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            html: errorMessages
          });
        },
        complete: () => {
          console.log('Solicitud completada');
          // Actualiza la lista de usuarios actuales
          this.actuales$ = this.servicioService.getDatosUsuario();
        },
      });
    }
  }

  // Método para obtener mensajes de error
  getErrorMessage(errors: any): string {
    if (Array.isArray(errors)) {
      return errors.join('<br>');
    } else if (typeof errors === 'string') {
      return errors;
    } else if (errors && typeof errors === 'object') {
      return Object.values(errors).join('<br>');
    } else {
      return 'Ocurrió un error inesperado';
    }
  }

  // Getters para acceder a los controles del formulario
  get nombre_user() {
    return this.newusuarioForm.get('nombre_user');
  }

  get nombre_compl_user() {
    return this.newusuarioForm.get('nombre_compl_user');
  }

  get contrasenia() {
    return this.newusuarioForm.get('contrasenia');
  }

  get email() {
    return this.newusuarioForm.get('email');
  }

  // Método para volver a la página de login
  goBack() {
    this.router.navigate(['/login']);
  }
}
