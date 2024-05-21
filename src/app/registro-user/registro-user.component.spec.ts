import { ComponentFixture, TestBed } from '@angular/core/testing'; // Importaciones necesarias para realizar pruebas unitarias en Angular
import { RegistroUserComponent } from './registro-user.component'; // Importa el componente a probar

describe('RegistroUserComponent', () => { // Describe el grupo de pruebas para RegistroUserComponent
  let component: RegistroUserComponent; // Declara una variable para el componente
  let fixture: ComponentFixture<RegistroUserComponent>; // Declara una variable para el fixture del componente

  beforeEach(() => { // beforeEach se ejecuta antes de cada prueba individual
    TestBed.configureTestingModule({
      declarations: [RegistroUserComponent] // Configura el TestBed con el componente que se va a probar
    });
    fixture = TestBed.createComponent(RegistroUserComponent); // Crea una instancia del componente y su fixture
    component = fixture.componentInstance; // Asigna la instancia del componente a la variable component
    fixture.detectChanges(); // Detecta los cambios para inicializar el componente
  });

  it('should create', () => { // Define una prueba para verificar que el componente se crea correctamente
    expect(component).toBeTruthy(); // Comprueba que la instancia del componente es verdadera (existe)
  });
});
