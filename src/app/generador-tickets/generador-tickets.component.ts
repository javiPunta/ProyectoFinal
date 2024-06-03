import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { Generado } from '../model/alluser';
import { Tienda } from '../model/tienda';
import { Router } from '@angular/router'; // Importa el servicio Router
import Swal from 'sweetalert2';

interface ToyItem {
  name: string;
  price: number;
}

@Component({
  selector: 'app-generador-tickets',
  styleUrls: ['./generador-tickets.component.scss'],
  template: `
    <div class="app-background">
      <div class="ticket-container">
        <h1><strong>{{ storeName }}</strong></h1>
        <p>Dirección: {{ address }}</p>
        <p>TELÉFONO: {{ phoneNumber }}</p>
        <p>NIF: {{ dni }}</p>
        <p>Fecha: {{ currentDateTime | date: 'dd/MM/yyyy' }} Hora: {{ currentDateTime | date: 'HH:mm' }}</p>
        <p>FACTURA SIMPLIFICADA: {{ facturaSimplificada }}</p>
        <div class="ticket-items">
          <ul>
            <li *ngFor="let item of toyItems">
              {{ item.name }} - {{ item.price | currency:'EUR' }}
            </li>
          </ul>
        </div>
        <p><strong>TOTAL: {{ total | currency:'EUR' }}</strong></p>
        <button (click)="generateTicket()">Generar Ticket</button>
      </div>
      <button (click)="goBack()" name="boton" value="volver" id="espacio">Volver Atras</button>
    </div>
  `
})
export class GeneradorTicketsComponent implements OnInit {
  currentDateTime: Date = new Date();
  phoneNumber: string = '';
  dni: string = '';
  storeName: string = '';
  address: string = '';
  toyItems: ToyItem[] = [];
  total: number = 0;
  facturaSimplificada: string = '';
  usuarios: Generado[] = [];
  selectedUser: string = '';
  tiendas: Tienda[] = [];
  selectedStoreId: number | null = null;

  private toyDatabase: ToyItem[] = [
    { name: 'Muñeca Bailarina', price: 10.99 },
    { name: 'Tren Eléctrico', price: 29.99 },
    { name: 'Set de Lego', price: 45.50 },
    { name: 'Peluche de Oso', price: 15.75 },
    { name: 'Coche a Control Remoto', price: 23.40 },
    { name: 'Puzzle 3D', price: 18.20 },
    { name: 'Kit de Ciencia', price: 27.30 },
    { name: 'Figura de Acción', price: 9.99 },
    { name: 'Balón de Fútbol', price: 14.95 },
    { name: 'Juego de Mesa', price: 19.95 }
  ];

  constructor(private servicio: ServicioService, private router: Router) {} // Inyecta el servicio Router

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarTiendas();
  }

  cargarUsuarios(): void {
    this.servicio.getDatosUsuario().subscribe(
      usuarios => {
        this.usuarios = usuarios;
      },
      error => {
        console.error('No se pudieron cargar los usuarios', error);
      }
    );
  }

  cargarTiendas(): void {
    this.servicio.getDatosTienda().subscribe(
      (tiendas: Tienda[]) => {
        console.log('Tiendas cargadas:', tiendas);
        this.tiendas = tiendas;
        this.generateTicket(); // Generar el ticket después de cargar las tiendas
      },
      error => {
        console.error('No se pudieron cargar las tiendas', error);
      }
    );
  }

  generateTicket() {
    if (this.tiendas.length === 0) {
      Swal.fire('Error', 'No hay tiendas disponibles', 'error');
      return;
    }

    const randomTiendaIndex = Math.floor(Math.random() * this.tiendas.length);
    const randomTienda = this.tiendas[randomTiendaIndex];
    this.storeName = randomTienda.nombre_tienda;
    this.selectedStoreId = randomTienda.id_tienda ?? null;
    this.phoneNumber = randomTienda.telefono;
    this.dni = this.generateRandomDNI();
    this.address = this.generateRandomAddress();
    this.currentDateTime = new Date();
    this.generateRandomToyItems();
    this.facturaSimplificada = this.generateRandomInvoiceNumber();

    Swal.fire({
      title: 'Ticket generado',
      text: `Número de factura simplificada: ${this.facturaSimplificada}. ¿Quieres guardar esta factura para un usuario?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Selecciona un usuario',
          input: 'select',
          inputOptions: this.usuarios.reduce((options: { [key: string]: string }, user) => {
            options[user.nombre_user] = user.nombre_user;
            return options;
          }, {}),
          inputPlaceholder: 'Selecciona un usuario',
          showCancelButton: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                this.selectedUser = value;
                this.guardarFacturaSimplificada();
                resolve(null);
              } else {
                resolve('Debes seleccionar un usuario');
              }
            });
          }
        });
      }
    });
  }

  private generateRandomDNI(): string {
    const dniNumbers = this.generateRandomDigits(8);
    const letter = this.calculateDNILetter(dniNumbers);
    return `${dniNumbers}${letter}`;
  }

  private calculateDNILetter(dniNumbers: string): string {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const position = parseInt(dniNumbers, 10) % 23;
    return letters.charAt(position);
  }

  private generateRandomDigits(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  private generateRandomInvoiceNumber(): string {
    return `${this.generateRandomDigits(4)}${this.generateRandomDigits(3)}${this.generateRandomDigits(5)}`;
  }

  private generateRandomAddress(): string {
    const streets = ['Avenida del Juguete', 'Calle de la Fantasía'];
    const numbers = ['123', '45'];
    const zipCodes = ['28001', '08002'];
    const cities = ['Madrid', 'Barcelona'];

    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    const zipCode = zipCodes[Math.floor(Math.random() * zipCodes.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];

    return `${street}, Nº ${number}, ${zipCode}, ${city}`;
  }

  private generateRandomToyItems() {
    const numberOfItems = Math.floor(Math.random() * 5) + 1;
    this.toyItems = [];
    this.total = 0;

    for (let i = 0; i < numberOfItems; i++) {
      const randomIndex = Math.floor(Math.random() * this.toyDatabase.length);
      const toyItem = this.toyDatabase[randomIndex];
      this.toyItems.push(toyItem);
      this.total += toyItem.price;
    }
  }

  goBack() {
    this.router.navigate(['/tabla']);
  }

  guardarFacturaSimplificada(): void {
    if (this.selectedUser && this.facturaSimplificada && this.selectedStoreId !== null) {
      const num_ticket_sin_guiones = parseInt(this.facturaSimplificada.replace(/-/g, ''), 10); // Convertir a entero
      const payload = {
        nombre_user: this.selectedUser,
        num_ticket: num_ticket_sin_guiones,
        id_tienda: this.selectedStoreId
      };
      console.log(payload); // Verificar los datos antes de enviar la solicitud
      this.servicio.guardarFacturaSimplificada(payload).subscribe(
        respuesta => {
          Swal.fire('Éxito', 'Factura simplificada guardada correctamente', 'success').then(() => {
            this.router.navigate(['/tabla']); // Redirigir a /tabla después de guardar
          });
        },
        error => {
          Swal.fire('Error', 'No se pudo guardar la factura simplificada', 'error');
        }
      );
    }
  }
}
