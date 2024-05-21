import { Component } from '@angular/core'; // Importa Component desde el núcleo de Angular
import { Router } from '@angular/router'; // Importa Router desde el módulo de enrutamiento de Angular

@Component({
  selector: 'app-polit-cookie', // Define el selector para el componente
  templateUrl: './polit-cookie.component.html', // Ruta al archivo de la plantilla HTML del componente
  styleUrls: ['./polit-cookie.component.scss'] // Ruta al archivo de estilos SCSS del componente
})
export class PolitCookieComponent {
  constructor(
    private router: Router // Inyección del servicio de Router para la navegación
  ) {}

  // Método para navegar a la página principal
  goHome() {
    this.router.navigate(['/principal']); // Navega a la ruta '/principal'
  }
}
