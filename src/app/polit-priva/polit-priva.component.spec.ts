import { ComponentFixture, TestBed } from '@angular/core/testing'; // Importa las herramientas necesarias para las pruebas unitarias en Angular

import { PolitPrivaComponent } from './polit-priva.component'; // Importa el componente que se va a probar

describe('PolitPrivaComponent', () => { // Describe el grupo de pruebas para PolitPrivaComponent
  let component: PolitPrivaComponent; // Declara una variable para la instancia del componente
  let fixture: ComponentFixture<PolitPrivaComponent>; // Declara una variable para el fixture del componente

  beforeEach(() => { // beforeEach se ejecuta antes de cada prueba individual
    TestBed.configureTestingModule({
      declarations: [PolitPrivaComponent] // Configura el TestBed con el componente que se va a probar
    });
    fixture = TestBed.createComponent(PolitPrivaComponent); // Crea una instancia del componente y su fixture
    component = fixture.componentInstance; // Asigna la instancia del componente a la variable component
    fixture.detectChanges(); // Detecta los cambios para inicializar el componente
  });

  it('should create', () => { // Define una prueba para verificar que el componente se crea correctamente
    expect(component).toBeTruthy(); // Comprueba que la instancia del componente es verdadera (existe)
  });
});
