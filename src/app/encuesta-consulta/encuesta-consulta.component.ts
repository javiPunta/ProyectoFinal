import { Component, OnInit } from '@angular/core';
import { Encuesta } from '../model/encuesta';
import { ServicioService } from '../servicio.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

interface PorcentajeRespuestas {
  si: number;
  no: number;
}

@Component({
  selector: 'app-encuesta-consulta',
  templateUrl: './encuesta-consulta.component.html',
  styleUrls: ['./encuesta-consulta.component.scss']
})
export class EncuestaConsultaComponent implements OnInit {
  encuestas: Encuesta[] = []; // Lista de encuestas recibidas
  session: string = ''; // Variable para almacenar la sesión del usuario
  tienda: string = ''; // Agrega esta línea para declarar la propiedad tienda
  porcentajes: Record<string, PorcentajeRespuestas> = {}; // Porcentajes de respuestas

  // Lista de preguntas de la encuesta
  preguntas = [
    { clave: 'e1', texto: '¿Estás satisfecho con la variedad de productos disponibles?' },
    { clave: 'e2', texto: '¿Encontraste útil la ayuda de nuestro personal cuando necesitaste asistencia?' },
    { clave: 'e3', texto: '¿Es buena la limpieza general de nuestra tienda?' },
    { clave: 'e4', texto: '¿Recomendarías nuestro supermercado a familiares y amigos?' },
    { clave: 'e5', texto: '¿Estás satisfecho con la relación calidad-precio de los productos que compraste?' },
    { clave: 'e6', texto: 'La tienda ofrecía suficientes cajas abiertas para evitar largas colas?' },
    { clave: 'e7', texto: '¿Cuál es la probabilidad de que vuelvas a comprar en nuestro supermercado?' }
  ];

  constructor(
    private cookieService: CookieService, // Servicio para manipular cookies
    private router: Router, // Servicio de enrutamiento
    private servicioService: ServicioService // Servicio para interactuar con la API
  ) {}

  ngOnInit() {
    // Obtiene la sesión del usuario de las cookies
    this.session = this.cookieService.get('session') || '';
    if (this.session) {
      this.cargarTienda();
    }
    // Carga las encuestas desde el servidor
    this.cargarEncuestas();
  }

  cargarTienda() {
    this.servicioService.getTiendaPorUsuario2(this.session).subscribe({
      next: (data) => {
        this.tienda = data.nombre_tienda || 'Sin tienda';
      },
      error: (error) => {
        console.error('Hubo un error al obtener la tienda del usuario:', error);
        this.tienda = 'Sin tienda';
      }
    });
  }

  cargarEncuestas() {
    this.servicioService.getDatosEncuesta().subscribe({
      next: (data: Encuesta[]) => {
        this.encuestas = data; // Asigna las encuestas recibidas
        this.calcularPorcentajes(); // Calcula los porcentajes de las respuestas
      },
      error: (error) => {
        console.error('Hubo un error al obtener las encuestas:', error);
      }
    });
  }

  calcularPorcentajes() {
    const preguntas = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7'];
    preguntas.forEach(pregunta => {
      // Calcula el número de respuestas 'Sí' y 'No' para cada pregunta
      const respuestasSi = this.encuestas.filter(encuesta => encuesta[pregunta] === 'Si').length;
      const respuestasNo = this.encuestas.filter(encuesta => encuesta[pregunta] === 'No').length;
      const totalRespuestas = respuestasSi + respuestasNo;

      if (totalRespuestas > 0) {
        // Calcula el porcentaje de respuestas 'Sí' y 'No'
        this.porcentajes[pregunta] = {
          si: ((respuestasSi / totalRespuestas) * 100),
          no: ((respuestasNo / totalRespuestas) * 100)
        };
      } else {
        this.porcentajes[pregunta] = { si: 0, no: 0 };
      }
    });
  }

  cerrarSesion() {
    this.cookieService.delete('session'); // Elimina la cookie de sesión
    this.router.navigate(['/']); // Redirige a la página principal
  }

  cambiarUsuario() {
    this.cookieService.delete('session'); // Elimina la cookie de sesión
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }

  goHome() {
    this.router.navigate(['/principal']); // Redirige a la página principal
  }
}
