import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss']
})
export class IntranetComponent {
  menuOpen = false;  // Estado del menú (abierto/cerrado)

  constructor(private router: Router) {}

  // Función para alternar el estado del menú
  toggleMenu() {
    this.menuOpen = !this.menuOpen;  // Cambiar el estado del menú
    const menu = document.querySelector('.menu') as HTMLElement;
    const ul = menu.querySelector('ul') as HTMLElement;
    const barry = menu.querySelector('.barry') as HTMLElement;

    if (this.menuOpen) {
      // Si el menú está abierto, ajustar los estilos
      menu.style.width = '500px';
      menu.style.height = '85px';
      ul.style.display = 'block';
      ul.style.opacity = '1';
      barry.style.display = 'none';
    } else {
      // Si el menú está cerrado, ajustar los estilos
      menu.style.width = '100px';
      menu.style.height = '100px';
      ul.style.display = 'none';
      ul.style.opacity = '0';
      barry.style.display = 'block';
    }
  }

  // Función para navegar al formulario de configuración
  goForm(event: Event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del enlace
    this.router.navigate(['/intranet-conf']);
  }

  // Función para navegar a la tabla
  goGen(event: Event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del enlace
    this.router.navigate(['/tabla']);
  }
}
