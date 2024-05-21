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
  encuestas: Encuesta[] = [];
  session: string = '';
  porcentajes: Record<string, PorcentajeRespuestas> = {};

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
    private cookieService: CookieService,
    private router: Router,
    private servicioService: ServicioService
  ) {}

  ngOnInit() {
    this.session = this.cookieService.get('session') || '';
    this.cargarEncuestas();
  }

  cargarEncuestas() {
    this.servicioService.getDatosEncuesta().subscribe({
      next: (data: Encuesta[]) => {
        this.encuestas = data;
        this.calcularPorcentajes();
      },
      error: (error) => {
        console.error('Hubo un error al obtener las encuestas:', error);
      }
    });
  }

  calcularPorcentajes() {
    const preguntas = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7'];
    preguntas.forEach(pregunta => {
      const respuestasSi = this.encuestas.filter(encuesta => encuesta[pregunta] === 'Si').length;
      const respuestasNo = this.encuestas.filter(encuesta => encuesta[pregunta] === 'No').length;
      const totalRespuestas = respuestasSi + respuestasNo;

      if (totalRespuestas > 0) {
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
    this.cookieService.delete('session');
    this.router.navigate(['/']);
  }

  cambiarUsuario() {
    this.cookieService.delete('session');
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/principal']);
  }
}
