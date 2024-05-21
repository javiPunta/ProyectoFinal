import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { CookieService } from 'ngx-cookie-service';
import { Encuesta } from '../model/encuesta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit {
  encuestaForm!: FormGroup;
  session: string = ''; // Variable session
  message: string = ''; // Propiedad para los mensajes
  clasec: string = ''; // Propiedad para la clase del mensaje
  ticketValid: boolean = false; // Propiedad para controlar la validez del ticket

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    // Verificar si la cookie de sesión existe
    const sessionCookieExists = this.cookieService.check('session');
    if (sessionCookieExists) {
      this.session = this.cookieService.get('session'); // Obtiene el valor de la cookie de sesión
    }

    const sessionCookie = this.getCookieValue('session');

    let usuarioValue = '';
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie);
        // Si el formato es JSON y contiene una propiedad 'usuario', lo asignamos
        if (sessionData.usuario) {
          usuarioValue = sessionData.usuario;
        }
      } catch (error) {
        // Si hay un error al analizar el JSON o no tiene el formato esperado, asignamos directamente el valor de la cookie
        usuarioValue = sessionCookie;
      }
    }

    // Inicializar el formulario de encuesta
    this.encuestaForm = this.fb.group({
      nombre_user: [usuarioValue], // Establece el valor inicial con `usuarioValue`
      e1: [''],
      e2: [''],
      e3: [''],
      e4: [''],
      e5: [''],
      e6: [''],
      e7: ['']
    });

    // Solicitar el número de ticket al cargar la página
    this.solicitarTicket();
  }

  // Función para obtener el valor de una cookie por su nombre
  getCookieValue(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      if (cookieValue !== undefined) {
        return cookieValue;
      }
    }
    return null;
  }

  solicitarTicket() {
    Swal.fire({
      title: 'Ingrese su número de ticket',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      showLoaderOnConfirm: true,
      preConfirm: (num_ticket) => {
        return this.servicioService.verificarTicket({ num_ticket }).toPromise()
          .then(response => {
            if (!response.valid) {
              throw new Error('El número de ticket no es válido');
            }
            return response;
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Error: ${error}`
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.ticketValid = true;
        Swal.fire({
          icon: 'success',
          title: 'Ticket válido',
          text: 'Puedes acceder a la encuesta.'
        });
      } else {
        this.router.navigate(['/']); // Redirigir a la página principal si no se ingresa un ticket válido
      }
    });
  }

  enviarRespuestas() {
    if (this.encuestaForm.valid) {
      // Crear un objeto que contiene todas las respuestas del formulario y el nombre de usuario.
      const formData: Encuesta = {
        ...this.encuestaForm.value,
        id_encuesta: 0, // Valor temporal, será asignado en el backend
        puntos_encuesta: 3 // Puntos por enviar la encuesta
      };

      console.log('Enviando datos:', formData);
      // Llamar al servicio y pasarle el objeto formData.
      this.servicioService.enviarRespuestasEncuesta(formData).subscribe({
        next: (response) => {
          // Si el servidor responde con éxito, procesar la respuesta aquí.
          console.log('Respuestas enviadas correctamente:', response);
          // Mostrar un mensaje de éxito y mantener al usuario en la misma página.
          Swal.fire({
            icon: 'success',
            title: '¡Encuesta enviada!',
            text: 'Gracias por tu tiempo. Redirigiendo a la página principal...',
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
              this.router.navigate(['/principal']);
            }
          });
        },
        error: (error) => {
          // Si hay un error en la solicitud, manejarlo aquí.
          console.error('Error al enviar respuestas:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar la encuesta. Por favor, inténtalo de nuevo.',
          });
        }
      });
    } else {
      // Si el formulario no es válido, puedes manejar esa situación aquí.
      this.message = 'Por favor corrige los errores en el formulario.';
      this.clasec = 'text-danger';
      console.error('El formulario no es válido');
    }
  }

  cerrarSesion() {
    this.cookieService.delete('session'); // Elimina la cookie de sesión
    this.session = ''; // Limpia la variable de sesión
    this.router.navigate(['/']);
  }

  cambiarUsuario() {
    this.cookieService.delete('session');
    this.session = '';
    this.router.navigate(['/login']); // Asegúrate de que la ruta '/login' esté configurada en tu AppRoutingModule
  }

  goHome() {
    this.router.navigate(['/principal']);
  }
}
