import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario'; // Importa el modelo de Usuario
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa las herramientas de formularios reactivos
import { Observable } from 'rxjs'; // Importa Observable de RxJS
import { ServicioService } from '../servicio.service'; // Importa el servicio de datos
import { Router, ActivatedRoute } from '@angular/router'; // Importa el router para navegación
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
  editMode: boolean = false; // Nueva propiedad para el modo de edición

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
    private route: ActivatedRoute, // Inyecta ActivatedRoute para obtener parámetros de la URL
    private cookieService: CookieService // Inyecta el servicio de cookies
  ) {}

  ngOnInit(): void {
    // Verifica si se está en modo de edición
    this.route.queryParams.subscribe(params => {
      if (params['editar']) {
        this.editMode = true;
        this.inicializarFormulario(true);
        this.cargarDatosUsuario();
      } else {
        this.inicializarFormulario(false);
      }
    });
  }

  inicializarFormulario(disableUserField: boolean): void {
    this.newusuarioForm = this.fb.group({
      nombre_user: [{ value: '', disabled: disableUserField }, Validators.required],
      nombre_compl_user: ['', Validators.required],
      contrasenia: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  cargarDatosUsuario() {
    const session = this.cookieService.get('session');
    this.servicioService.getDatosUsuarioCorreo().subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(u => u.nombre_user === session);
        if (usuario) {
          this.newusuarioForm.patchValue({
            nombre_user: usuario.nombre_user,
            nombre_compl_user: usuario.nombre_compl_user,
            contrasenia: usuario.contrasenia,
            email: usuario.email
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar los datos del usuario', error);
      }
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
      const newusuario = this.newusuarioForm.getRawValue();
      if (this.editMode) {
        this.servicioService.modificarUsuario(newusuario).subscribe({
          next: (resp) => {
            this.resp = resp;
            if (resp.msg) {
              // Muestra un mensaje de éxito si la actualización es exitosa
              Swal.fire({
                icon: 'success',
                title: 'Actualización Exitosa',
                text: 'El usuario ha sido actualizado correctamente.',
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                // Navega al componente principal
                this.router.navigate(['/principal']);
              });
            } else if (resp.error) {
              // Muestra un mensaje de error si hay errores en la respuesta
              const errorMessages = this.getErrorMessage(resp.error);
              Swal.fire({
                icon: 'error',
                title: 'Error en la actualización',
                html: errorMessages
              });
            }
          },
          error: (err) => {
            const errorMessages = this.getErrorMessage(err.error);
            Swal.fire({
              icon: 'error',
              title: 'Error en la actualización',
              html: errorMessages
            });
          }
        });
      } else {
        this.servicioService.getDatosRegistro(newusuario).subscribe({
          next: (resp) => {
            this.resp = resp;
            if (resp.msg) {
              // Configura la cookie de sesión
              const currentDate = new Date();
              const expirationDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 1
              );
              this.cookieService.set('session', newusuario.nombre_user, expirationDate, '/', 'localhost', false, "Lax");

              // Muestra un mensaje de éxito si el registro es exitoso
              Swal.fire({
                icon: 'success',
                title: 'Registro Exitoso',
                text: 'El usuario ha sido registrado correctamente.',
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                // Navega al componente principal
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
            const errorMessages = this.getErrorMessage(err.error);
            Swal.fire({
              icon: 'error',
              title: 'Error en el registro',
              html: errorMessages
            });
          }
        });
      }
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
