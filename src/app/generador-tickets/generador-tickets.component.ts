import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service'; 
import { Generado } from '../model/alluser'; 
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

  private storeNames: string[] = [
    'Juguettos',
    'Poly',
    'Eurekakids',
    'Imaginarium',
    'Drim',
    'Nabumbu Toys',
    'Toy Planet',
    'Juguetilandia',
    'Tutete',
    'Juguetes El Corte Inglés'
  ];

  private addressParts = {
    streets: ['Avenida del Juguete', 'Calle de la Fantasía', 'Paseo de los Niños', 'Vía Lúdica'],
    numbers: ['123', '45', '6B', '78A'],
    zipCodes: ['28001', '08002', '41004', '29005'],
    cities: ['Madrid', 'Barcelona', 'Sevilla', 'Málaga']
  };

  constructor(private servicio: ServicioService) {
    this.generateTicket(); // Generar un ticket al instanciar el componente
  }

  ngOnInit() {
    this.cargarUsuarios();
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

  generateTicket() {
    this.storeName = this.storeNames[Math.floor(Math.random() * this.storeNames.length)];
    this.phoneNumber = this.generateRandomPhoneNumber();
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
        // Mostrar select para elegir usuario
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

  private generateRandomPhoneNumber(): string {
    const phonePrefix = '6'; // Spanish mobile numbers start with 6 or 7
    let phoneNumber = phonePrefix;
    for (let i = 0; i < 8; i++) {
      phoneNumber += Math.floor(Math.random() * 10).toString();
    }
    return phoneNumber;
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
    return `${this.generateRandomDigits(4)}-${this.generateRandomDigits(3)}-${this.generateRandomDigits(5)}`;
  }

  private generateRandomAddress(): string {
    const street = this.addressParts.streets[Math.floor(Math.random() * this.addressParts.streets.length)];
    const number = this.addressParts.numbers[Math.floor(Math.random() * this.addressParts.numbers.length)];
    const zipCode = this.addressParts.zipCodes[Math.floor(Math.random() * this.addressParts.zipCodes.length)];
    const city = this.addressParts.cities[Math.floor(Math.random() * this.addressParts.cities.length)];

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

  guardarFacturaSimplificada(): void {
    if (this.selectedUser && this.facturaSimplificada) {
      const num_ticket_sin_guiones = this.facturaSimplificada.replace(/-/g, ''); // Eliminar guiones
      const payload = {
        nombre_user: this.selectedUser,
        num_ticket: num_ticket_sin_guiones
      };
      console.log(payload); // Verificar los datos antes de enviar la solicitud
      this.servicio.guardarFacturaSimplificada(payload).subscribe(
        respuesta => {
          Swal.fire('Éxito', 'Factura simplificada guardada correctamente', 'success');
        },
        error => {
          Swal.fire('Error', 'No se pudo guardar la factura simplificada', 'error');
        }
      );
    }
  }
}
