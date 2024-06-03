// intranet-table.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ServicioService } from '../servicio.service';
import { Tabla } from '../model/tabla';
import { Tienda } from '../model/tienda';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

// Interface para extender la clase Tabla con un campo adicional opcional
interface TablaEdit extends Tabla {
  originalNombre_user?: string;
}

@Component({
  selector: 'app-intranet-table',
  templateUrl: './intranet-table.component.html',
  styleUrls: ['./intranet-table.component.scss']
})
export class IntranetTableComponent implements OnInit {
  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['email', 'nombreCompleto', 'contrasenia', 'nombreTienda', 'numTicket', 'puntosJuego', 'puntosEncuesta', 'acciones'];
  dataSource!: MatTableDataSource<Tabla>;
  usuarios: Tabla[] = [];  // Array para almacenar los usuarios
  tiendas: Tienda[] = [];  // Array para almacenar las tiendas
  mostrarFormularioAgregarUsuario = false;  // Booleano para mostrar/ocultar el formulario de agregar usuario
  usuarioEditando: TablaEdit | null = null;  // Usuario que se está editando actualmente
  nuevoUsuario: Tabla = {  // Objeto para almacenar los datos del nuevo usuario
    nombre_user: '',
    nombre_compl_user: '',
    contrasenia: '',
    email: '',
    nombre_tienda: '',
    num_ticket: 0,
    puntos_juego: 0,
    puntos_encuesta: 0
  } as Tabla;
  isSidebarVisible: boolean = false;  // Booleano para manejar la visibilidad de la barra lateral

  // Decoradores para acceder a los componentes del DOM
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private servicio: ServicioService, private router: Router) {}

  ngOnInit() {
    this.cargarUsuarios();  // Cargar usuarios al inicializar el componente
    this.cargarTiendas();  // Cargar tiendas al inicializar el componente
  }

  // Método para cargar las tiendas desde el servicio
  cargarTiendas(): void {
    this.servicio.getDatosTienda().subscribe(
      tiendasDesdeElBackend => {
        this.tiendas = tiendasDesdeElBackend;
      },
      error => {
        console.error('No se pudieron cargar las tiendas', error);
      }
    );
  }

  // Método para alternar la visibilidad de la barra lateral
  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // Método para alternar la visibilidad del formulario de agregar usuario y resetear el formulario si se cierra
  alternarFormularioAgregarUsuario(): void {
    this.mostrarFormularioAgregarUsuario = !this.mostrarFormularioAgregarUsuario;
    if (!this.mostrarFormularioAgregarUsuario) {
      this.resetNuevoUsuario();
    }
  }

  // Método para iniciar la edición de un usuario
  editarUsuario(usuario: Tabla): void {
    this.usuarioEditando = { ...usuario, originalNombre_user: usuario.nombre_user };
  }

  // Método para guardar los cambios del usuario editado
  guardarCambiosUsuario(): void {
    if (!this.usuarioEditando) {
      Swal.fire('Error', 'No hay un usuario seleccionado para editar.', 'error');
      return;
    }

    const camposModificados: any = {
      nombre_user: this.usuarioEditando.nombre_user,
      nombre_compl_user: this.usuarioEditando.nombre_compl_user || '',
      contrasenia: this.usuarioEditando.contrasenia || '',
      email: this.usuarioEditando.email || '',
      nombre_tienda: this.usuarioEditando.nombre_tienda || null,
      num_ticket: this.usuarioEditando.num_ticket || null,
      puntos_juego: this.usuarioEditando.puntos_juego || null,
      puntos_encuesta: this.usuarioEditando.puntos_encuesta || null
    };

    console.log('Enviando datos de usuario:', camposModificados);

    this.servicio.modificarUsuarioAll(camposModificados).subscribe(
      respuesta => {
        console.log('Usuario actualizado correctamente.', respuesta);
        const index = this.usuarios.findIndex(u => u.nombre_user === this.usuarioEditando!.originalNombre_user);
        if (index !== -1) {
          this.usuarios[index] = { ...this.usuarioEditando } as Tabla;
        }
        this.dataSource.data = this.usuarios;  // Actualizar los datos de la tabla
        Swal.fire('Éxito', 'Usuario actualizado correctamente.', 'success');
        this.usuarioEditando = null;
      },
      error => {
        console.error('Error al actualizar usuario: ', error);
        Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
      }
    );
  }

  // Método para cancelar la edición de un usuario
  cancelarEdicionUsuario(): void {
    this.usuarioEditando = null;
  }

  // Método para eliminar un usuario
  eliminarUsuario(user: Tabla): void {
    console.log("Intentando eliminar usuario:", user);
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.servicio.borrarUsuario(user).subscribe(
        respuesta => {
          console.log('Usuario eliminado:', respuesta);
          this.usuarios = this.usuarios.filter(u => u.nombre_user !== user.nombre_user);
          this.dataSource.data = this.usuarios;  // Actualizar los datos de la tabla
          Swal.fire('Éxito', 'Usuario eliminado correctamente.', 'success');
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
          Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
        }
      );
    }
  }

  // Método para manejar el envío del formulario de agregar usuario
  onSubmitAgregarUsuario(): void {
    if (!this.nuevoUsuario.nombre_user || !this.nuevoUsuario.email || !this.nuevoUsuario.contrasenia) {
      Swal.fire('Error', 'Nombre de usuario, email y contraseña son obligatorios.', 'error');
      return;
    }

    const nuevoUsuarioData: Tabla = {
      nombre_user: this.nuevoUsuario.nombre_user,
      email: this.nuevoUsuario.email,
      contrasenia: this.nuevoUsuario.contrasenia,
      nombre_compl_user: this.nuevoUsuario.nombre_compl_user,
      nombre_tienda: this.nuevoUsuario.nombre_tienda,
      num_ticket: this.nuevoUsuario.num_ticket,
      puntos_juego: this.nuevoUsuario.puntos_juego,
      puntos_encuesta: this.nuevoUsuario.puntos_encuesta
    };

    this.servicio.agregarUsuario(nuevoUsuarioData).subscribe(
      respuesta => {
        console.log('Usuario agregado correctamente.', respuesta);
        this.usuarios.push({ ...nuevoUsuarioData });
        this.dataSource.data = this.usuarios;  // Actualizar los datos de la tabla
        this.mostrarFormularioAgregarUsuario = false;
        this.resetNuevoUsuario();
        Swal.fire('Éxito', 'Usuario agregado correctamente.', 'success');
      },
      error => {
        console.error('Error al agregar usuario: ', error);
        Swal.fire('Error', 'No se pudo agregar el usuario.', 'error');
      }
    );
  }

  // Método para resetear los valores del nuevo usuario
  resetNuevoUsuario(): void {
    this.nuevoUsuario = {
      nombre_user: '',
      nombre_compl_user: '',
      contrasenia: '',
      email: '',
      nombre_tienda: '',
      num_ticket: 0,
      puntos_juego: 0,
      puntos_encuesta: 0
    } as Tabla;
  }

  // Método para cancelar el formulario de agregar usuario
  cancelarAgregarUsuario(): void {
    this.mostrarFormularioAgregarUsuario = false;
  }

  // Método para cargar los usuarios desde el servicio
  cargarUsuarios(): void {
    this.servicio.getDatosUsuarioCorreo().subscribe(
      (datos: Tabla[]) => {
        this.usuarios = datos;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al obtener los datos de los usuarios:', error);
        Swal.fire('Error', 'No se pudieron obtener los datos de los usuarios.', 'error');
      }
    );
  }

  // Método para aplicar un filtro a la tabla basado en el texto ingresado
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Métodos de navegación para diferentes rutas
  goForm(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/intranet-conf']);
  }

  goHome(): void {
    this.router.navigate(['/intranet']);
  }

  goConsulta(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/consulta']);
  }

  goGenerador(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/generador']);
  }

  goBack() {
    this.router.navigate(['/intranet']);
  }
}
