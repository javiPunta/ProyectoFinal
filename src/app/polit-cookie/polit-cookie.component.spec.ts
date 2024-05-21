import { ComponentFixture, TestBed } from '@angular/core/testing'; // Importa las herramientas necesarias para las pruebas unitarias en Angular
import { PolitCookieComponent } from './polit-cookie.component'; // Importa el componente que se va a probar

describe('PolitCookieComponent', () => { // Describe el grupo de pruebas para PolitCookieComponent
  let component: PolitCookieComponent; // Declara una variable para la instancia del componente
  let fixture: ComponentFixture<PolitCookieComponent>; // Declara una variable para el fixture del componente

  beforeEach(() => { // beforeEach se ejecuta antes de cada prueba individual
    TestBed.configureTestingModule({
      declarations: [PolitCookieComponent] // Configura el TestBed con el componente que se va a probar
    });
    fixture = TestBed.createComponent(PolitCookieComponent); // Crea una instancia del componente y su fixture
    component = fixture.componentInstance; // Asigna la instancia del componente a la variable component
    fixture.detectChanges(); // Detecta los cambios para inicializar el componente
  });

  it('should create', () => { // Define una prueba para verificar que el componente se crea correctamente
    expect(component).toBeTruthy(); // Comprueba que la instancia del componente es verdadera (existe)
  });
});
