import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-polit-priva',
  templateUrl: './polit-priva.component.html',
  styleUrls: ['./polit-priva.component.scss']
})
export class PolitPrivaComponent {
  constructor(
    private router: Router // Inyección del servicio de Router para la navegación
  ){}

  // Método para navegar a la página principal
  goHome() {
    this.router.navigate(['/principal']); // Navega a la ruta '/principal'
  }
}
