import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServicioService } from '../servicio.service';
import { TiendaUser } from '../model/tienda_user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  mostrarFooter: boolean = true;
  session: string = '';
  mostrarMenuUsuario: boolean = false;
  newtiendaForm!: FormGroup;

  constructor(
    private cookieService: CookieService,
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private router: Router
  ) {}

  ngOnInit() {
    const sessionCookieExists = this.cookieService.check('session');
    if (sessionCookieExists) {
      this.session = this.cookieService.get('session');
    }
    this.mostrarFooter = !this.cookieService.check('Cookies');

    this.newtiendaForm = this.fb.group({
      nombre_user: [this.session, Validators.required], 
      nombre_tienda: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9\\s]{3,50}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]]
    });
  }

  cerrarSesion() {
    this.cookieService.delete('session');
    this.session = '';
    this.mostrarMenuUsuario = false;
    this.router.navigate(['/']);
  }

  cambiarUsuario() {
    this.cookieService.delete('session');
    this.session = '';
    this.router.navigate(['/login']);
  }

  aceptarCookies() {
    const fechaActual = new Date();
    const fechaExpiracion = new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000); 

    this.cookieService.set('Cookies', 'Aceptadas', fechaExpiracion);
    this.mostrarFooter = false;
  }

  rechazarCookies() {
    Swal.fire({
      title: 'Cookies Rechazadas',
      html: '<img src="assets/images/cookie/cookie.jpg" alt="Imagen de cookies rechazadas" style="max-width: 100%;">',
      confirmButtonText: 'Cerrar'
    });

    this.mostrarFooter = true;
  }

  entradatienda() {
    if (this.newtiendaForm.valid) {
      const tienda: TiendaUser = {
        nombre_tienda: this.newtiendaForm.value.nombre_tienda,
        telefono: this.newtiendaForm.value.telefono,
        nombre_user: this.newtiendaForm.value.nombre_user
      };

      this.servicioService.getDatosRegistroTienda(tienda).subscribe({
        next: (resp) => {
          if (!resp.error) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Tienda registrada exitosamente!',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.newtiendaForm.reset();
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: resp.error.msg
            });
          }
        },
        error: (error) => {
          const errorMessages = this.getErrorMessage(error.error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: errorMessages,
            footer: 'Inténtalo de nuevo más tarde'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'Por favor, completa el formulario correctamente.'
      });
    }
  }

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

  goLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

  goCookie(event: Event) {
    event.preventDefault();
    this.router.navigate(['/cookie']);
  }

  goLegal(event: Event) {
    event.preventDefault();
    this.router.navigate(['/privacidad']);
  }

  goSnake(event: Event) {
    event.preventDefault();
    if (this.session) {
      this.router.navigate(['/memorama']);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: 'memorama' } });
    }
  }

  goEncuesta(event: Event) {
    event.preventDefault();
    if (this.session) {
      this.router.navigate(['/encuesta']);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: 'encuesta' } });
    }
  }

  goConsulta(event: Event) {
    event.preventDefault();
    if (this.session) {
      this.router.navigate(['/consulta']);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: 'consulta' } });
    }
  }

  goRanking(event: Event) {
    event.preventDefault();
    this.router.navigate(['/ranking']);
  }
}