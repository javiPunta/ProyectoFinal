import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicioService } from '../servicio.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intranet-config',
  templateUrl: './intranet-config.component.html',
  styleUrls: ['./intranet-config.component.scss']
})
export class IntranetConfigComponent implements OnInit {
  seleccion: string = '';
  newusuarioForm!: FormGroup;
  newtiendaForm!: FormGroup;
  message: string = '';
  accionTienda: string = '';

  constructor(
    private servicioService: ServicioService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newusuarioForm = this.fb.group({
      nombre_user: ['', Validators.required],
      nombre_compl_user: ['', Validators.required],
      contrasenia: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.newtiendaForm = this.fb.group({
      id_tienda: [null],
      nombre_tienda: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }

  entradaUsuario(accion: string) {
    const usuario = this.newusuarioForm.value;

    switch (accion) {
      case 'add':
        if (this.newusuarioForm.invalid) {
          Swal.fire('Error', 'Por favor, rellena todos los campos requeridos.', 'error');
          return;
        }
        this.servicioService.getDatosRegistro(usuario).subscribe({
          next: (resp) => {
            if (resp.error) {
              Swal.fire('Error', resp.error.join(', '), 'error');
            } else {
              Swal.fire('Éxito', 'Usuario creado exitosamente', 'success');
              this.newusuarioForm.reset();
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Ocurrió un error al crear el usuario', 'error');
          }
        });
        break;
      case 'modify':
        if (!usuario.nombre_user || (!usuario.nombre_compl_user && !usuario.contrasenia && !usuario.email)) {
          Swal.fire('Error', 'Debes rellenar el nombre de usuario y al menos uno de los campos adicionales: Nombre completo, Correo electrónico o Contraseña.', 'error');
          return;
        }
        this.servicioService.modificarUsuario(usuario).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Usuario modificado con éxito', 'success');
            this.newusuarioForm.reset();
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error al modificar el usuario', 'error');
          }
        });
        break;
      case 'delete':
        if (!usuario.nombre_user) {
          Swal.fire('Error', 'Por favor, introduce el nombre de usuario para borrar.', 'error');
          return;
        }
        this.servicioService.borrarUsuario(usuario).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Usuario borrado con éxito', 'success');
            this.newusuarioForm.reset();
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error al borrar el usuario', 'error');
          }
        });
        break;
      default:
        Swal.fire('Error', 'Acción no reconocida', 'error');
    }
  }

  mostrarCamposEditarTienda() {
    this.accionTienda = 'edit';
  }

  entradaTienda(accion: string) {
    const tienda = this.newtiendaForm.value;

    switch (accion) {
      case 'add':
        if (this.newtiendaForm.invalid) {
          Swal.fire('Error', 'Todos los campos requeridos deben ser llenados correctamente.', 'error');
          return;
        }
        this.servicioService.getDatosRegistroTienda(tienda).subscribe({
          next: (resp) => {
            Swal.fire('Éxito', 'Tienda añadida exitosamente', 'success');
            this.newtiendaForm.reset();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Ocurrió un error al añadir la tienda', 'error');
          }
        });
        break;
      case 'delete':
        if (!tienda.id_tienda) {
          Swal.fire('Error', 'Por favor, introduce el ID de la tienda para borrar.', 'error');
          return;
        }
        this.servicioService.borrarTienda(tienda.id_tienda).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Tienda borrada con éxito', 'success');
            this.newtiendaForm.reset();
            this.accionTienda = '';
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error al borrar la tienda', 'error');
          }
        });
        break;
      case 'modify':
        if (!tienda.id_tienda || (!tienda.nombre_tienda && !tienda.telefono)) {
          Swal.fire('Error', 'Debes rellenar el ID y al menos uno de los campos: Nombre o Teléfono.', 'error');
          return;
        }
        this.servicioService.modificarTienda(tienda).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Tienda modificada con éxito', 'success');
            this.newtiendaForm.reset();
            this.accionTienda = '';
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error al modificar la tienda', 'error');
          }
        });
        break;
      default:
        Swal.fire('Error', 'Acción no reconocida', 'error');
    }
  }

  cancelarAccion() {
    this.accionTienda = '';
    this.newtiendaForm.reset();
  }

  goHome() {
    this.router.navigate(['/tabla']);
  }

  goBack() {
    this.router.navigate(['/intranet']);
  }
}
