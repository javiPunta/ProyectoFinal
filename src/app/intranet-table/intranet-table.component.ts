import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ServicioService } from '../servicio.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tabla } from '../model/tabla';
import { Tienda } from '../model/tienda';

interface TablaEdit extends Tabla {
  originalNombre_user?: string;
}

@Component({
  selector: 'app-intranet-table',
  templateUrl: './intranet-table.component.html',
  styleUrls: ['./intranet-table.component.scss']
})
export class IntranetTableComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) datatableElement!: DataTableDirective;

  usuarios: Tabla[] = [];
  tiendas: Tienda[] = [];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    searching: true,
    ordering: true
  };
  dtTrigger: Subject<any> = new Subject();
  mostrarFormularioAgregarUsuario = false;
  usuarioEditando: TablaEdit | null = null;
  nuevoUsuario: Tabla = {
    nombre_user: '',
    nombre_compl_user: '',
    contrasenia: '',
    email: '',
    nombre_tienda: '',
    telefono: '',
    num_ticket: 0,
    puntos_juego: 0,
    puntos_encuesta: 0
  } as Tabla;
  isSidebarVisible: boolean = false;

  constructor(private servicio: ServicioService, private router: Router) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      ordering: true,
    };
    this.cargarUsuarios();
    this.cargarTiendas();
  }

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

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  alternarFormularioAgregarUsuario(): void {
    this.mostrarFormularioAgregarUsuario = !this.mostrarFormularioAgregarUsuario;
    if (!this.mostrarFormularioAgregarUsuario) {
      this.nuevoUsuario = {
        nombre_user: '',
        nombre_compl_user: '',
        contrasenia: '',
        email: '',
        nombre_tienda: '',
        telefono: '',
        num_ticket: 0,
        puntos_juego: 0,
        puntos_encuesta: 0
      } as Tabla;
    }
  }

  editarUsuario(usuario: Tabla): void {
    this.usuarioEditando = { ...usuario, originalNombre_user: usuario.nombre_user };
  }

  guardarCambiosUsuario(): void {
    if (!this.usuarioEditando || !this.usuarioEditando.nombre_user) {
      console.error('El usuario no tiene un nombre de usuario');
      return;
    }
  
    this.servicio.modificarUsuarioAll(this.usuarioEditando).subscribe(
      respuesta => {
        console.log('Usuario actualizado correctamente.', respuesta);
        const index = this.usuarios.findIndex(u => u.nombre_user === this.usuarioEditando!.originalNombre_user);
        if (index !== -1) {
          const updatedUser = { ...this.usuarioEditando };
          delete updatedUser.originalNombre_user;
          this.usuarios[index] = updatedUser as Tabla;
        }
        this.rerender();
        Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
        this.usuarioEditando = null;
      },
      error => {
        console.error('Error al actualizar usuario: ', error);
        if (error.error && error.error.error && error.error.error.msg) {
          Swal.fire('Error', error.error.error.msg, 'error');
        } else {
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
      }
    );
  }
  

  cancelarEdicionUsuario(): void {
    this.usuarioEditando = null;
  }

  eliminarUsuario(user: Tabla, index: number): void {
    console.log("Intentando eliminar usuario:", user);
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.servicio.borrarUsuario(user).subscribe(
        respuesta => {
          console.log('Usuario eliminado:', respuesta);
          this.usuarios.splice(index, 1);
          this.rerender();
          Swal.fire('Éxito', 'Usuario eliminado correctamente', 'success');
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
          Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
        }
      );
    }
  }

  onSubmitAgregarUsuario(): void {
    if (!this.nuevoUsuario.nombre_user || !this.nuevoUsuario.email) {
      Swal.fire('Error', 'Nombre y email son obligatorios', 'error');
      return;
    }

    this.servicio.agregarUsuario(this.nuevoUsuario).subscribe(
      respuesta => {
        console.log('Usuario agregado correctamente.', respuesta);
        this.usuarios.push({ ...this.nuevoUsuario });
        this.rerender();
        this.mostrarFormularioAgregarUsuario = false;
        this.nuevoUsuario = {
          nombre_user: '',
          nombre_compl_user: '',
          contrasenia: '',
          email: '',
          nombre_tienda: '',
          telefono: '',
          num_ticket: 0,
          puntos_juego: 0,
          puntos_encuesta: 0
        } as Tabla;
        Swal.fire('Éxito', 'Usuario agregado correctamente', 'success');
      },
      error => {
        console.error('Error al agregar usuario: ', error);
        Swal.fire('Error', 'No se pudo agregar el usuario', 'error');
      }
    );
  }

  cancelarAgregarUsuario(): void {
    this.mostrarFormularioAgregarUsuario = false;
  }

  cargarUsuarios(): void {
    this.servicio.getDatosUsuarioCorreo().subscribe(
      (datos: Tabla[]) => {
        this.usuarios = datos.map(user => ({
          nombre_user: user.nombre_user || '', // Asegurarse de que todos los campos estén definidos
          email: user.email || '',
          nombre_compl_user: user.nombre_compl_user || '',
          contrasenia: user.contrasenia || '',
          nombre_tienda: user.nombre_tienda || '',
          telefono: user.telefono || '',
          num_ticket: user.num_ticket || 0,
          puntos_juego: user.puntos_juego || 0,
          puntos_encuesta: user.puntos_encuesta || 0
        }));
        console.log('Datos de usuarios cargados:', this.usuarios);
        this.rerender();
      },
      error => {
        console.error('Error al obtener los datos de los usuarios:', error);
      }
    );
  }

  rerender(): void {
    if (this.datatableElement && this.datatableElement.dtInstance) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy(); // Destruye la instancia anterior
        this.dtTrigger.next(null); // Inicializa de nuevo con los nuevos datos
      });
    } else {
      this.dtTrigger.next(null); // Inicialización sin necesidad de destruir
    }
  }

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
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    if (this.datatableElement && this.datatableElement.dtInstance) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
  }
}
