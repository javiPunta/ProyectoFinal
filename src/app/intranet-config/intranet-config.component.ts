import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario';
import { Tienda } from '../model/tienda';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ServicioService } from '../servicio.service';
import { Router } from '@angular/router';


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
  clasec: string = '';
  clases: string = 'text-info';
  resp: any;
  actuales$!: Observable<Usuario[]>;
  actuales2$!: Observable<Tienda[]>;
  constructor(
    private servicioService: ServicioService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newusuarioForm = this.fb.group({
      nombre_user: ['', Validators.required],
      nombre_compl_user: [''],
      contrasenia: [''],
      email: ['', Validators.email]
    });
    
  this.newtiendaForm = this.fb.group({
    id_tienda: [null], // Usualmente no necesitas este campo en el formulario si es autoincremental
    nombre_tienda: ['', Validators.required],
    telefono: ['', Validators.required],
  });

  }

  entradaUsuario(accion: string) {
    const usuario = this.newusuarioForm.value;
    const camposModificados: any = {};

    Object.keys(usuario).forEach(key => {
      if (usuario[key] !== '') {
        camposModificados[key] = usuario[key];
      }
    });

      switch (accion) {
        case 'add':
          if (this.newusuarioForm.invalid) {
            this.message = 'Por favor corrige los errores';
            this.clasec = 'text-danger';
            return;
          }
          this.servicioService.getDatosRegistro(usuario).subscribe({
            next: (resp) => {
              alert('Usuario creado exitosamente!');
              this.newusuarioForm.reset();
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => this.actuales$ = this.servicioService.getDatosUsuario()
          });
          break;
        case 'delete':
          if (!usuario.nombre_user) {
            alert('Por favor, introduce un nombre de usuario para borrar.');
            return;
          }
          this.servicioService.borrarUsuario(usuario).subscribe({
            next: (response) => {
              alert('Usuario borrado con éxito');
              this.newusuarioForm.reset();
            },
            error: (error) => {
              console.error(error);
            }
          });
          break;
          case 'modify':
            // Llamada al servicio modificarUsuario
            if (Object.keys(camposModificados).length > 0) {
              this.servicioService.modificarUsuario({
                nombre_user: usuario.nombre_user,
                camposModificados
              }).subscribe({
                next: (response) => {
                  alert('Usuario modificado con éxito');
                  // Puedes restablecer el formulario o actualizar la vista según sea necesario
                  this.newusuarioForm.reset();
                  this.actuales$ = this.servicioService.getDatosUsuario();
                },
                error: (error) => {
                  // Aquí manejas los errores
                  this.message = 'Error al modificar el usuario.';
                  this.clasec = 'text-danger';
                  console.error(error);
                }
              });
            } else {
              // Si no hay campos para modificar, muestra un mensaje o maneja como consideres
              this.message = 'No se ha modificado ningún campo.';
              this.clasec = 'text-warning';
            }
            break;

        default:
          alert('Acción no reconocida');
      }
  }

entradaTienda(accion: string) {
  const tienda = this.newtiendaForm.value;
  const camposModificados: any = {};

  Object.keys(tienda).forEach(key => {
    if (tienda[key] !== '') {
      camposModificados[key] = tienda[key];
    }
  });

  switch (accion) {
    case 'add':
      if (this.newtiendaForm.invalid) {
        this.message = 'Todos los campos requeridos deben ser llenados correctamente.';
        this.clasec = 'text-danger';
        return;
      }
      this.servicioService.getDatosRegistroTienda(tienda).subscribe({
        next: (resp) => {
          alert('Tienda añadida exitosamente!');
          this.newtiendaForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.message = 'Error al añadir la tienda.';
          this.clasec = 'text-danger';
        }
      });
      break;
    case 'delete':
      if (!tienda.nombre_tienda) {
        alert('Por favor, introduce el nombre de la tienda para borrar.');
        return;
      }
      this.servicioService.borrarTienda(tienda).subscribe({
        next: (response) => {
          alert('Tienda borrada con éxito');
          this.newtiendaForm.reset();
        },
        error: (error) => {
          console.error(error);
          this.message = 'Error al borrar la tienda.';
          this.clasec = 'text-danger';
        }
      });
      break;
      case 'modify':
        if (Object.keys(camposModificados).length > 0) {
          // La llamada al servicio modificarTienda ahora incluye camposModificados directamente
          this.servicioService.modificarTienda({
            id_tienda: tienda.id_tienda, // Asegúrate de que este campo se esté estableciendo correctamente
            ...camposModificados // Utiliza el operador de propagación para incluir todos los campos modificados
          }).subscribe({
            next: (response) => {
              alert('Tienda modificada con éxito');
              this.newtiendaForm.reset();
              // Aquí podrías actualizar la lista de tiendas actuales si es necesario
            },
            error: (error) => {
              console.error(error);
              this.message = 'Error al modificar la tienda.';
              this.clasec = 'text-danger';
            }
          });
        } else {
          this.message = 'No se ha modificado ningún campo.';
          this.clasec = 'text-warning';
        }
        break;
    default:
      alert('Acción no reconocida');
  }
}


  goHome() {
    this.router.navigate(['/tabla']);
  }
}
