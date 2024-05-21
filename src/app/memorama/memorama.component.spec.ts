/* Importes de archivos. */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MemoramaComponent } from './memorama.component';

/* Pruebas que se le hace al componente */
describe('MemoramaComponent', () => { 
  beforeEach(async () => {
    /* Configura el entorno de prueba de Angular.
    Esta función toma un objeto de configuración que especifica qué módulos y componentes
    se deben cargar para la prueba.*/
    await TestBed.configureTestingModule({ // Especifica qué módulos y componentes se deben cargar para la prueba.
      imports: [ // Importa módulos necesarios para la prueba.

        RouterTestingModule // Simula el enrutamiento en el entorno de prueba.

      ],
      declarations: [ // Declaración del componente que se va a probar.

        MemoramaComponent 

      ],
    }).compileComponents(); // Compila los componentes y módulos necesarios para la prueba.
  });

  /* Prueba que verifica si el componente se ha creado correctamente. */
  it('should create the app', () => { //Si el componente funciona correctamente...
    const fixture = TestBed.createComponent(MemoramaComponent); // crea una instancia del componente.
    const app = fixture.componentInstance; // obtiene una referencia al componente.
    expect(app).toBeTruthy();  // comprueba si el componente se ha creado con éxito.
  });

  /* Prueba que verifica si el título del componente es el esperado. */
  it(`should have as title 'snake'`, () => { // Si el componente tiene ese valor..
    const fixture = TestBed.createComponent(MemoramaComponent); // crea una instancia del componente.
    const app = fixture.componentInstance; // obtiene una referencia al componente.
    expect(app.title).toEqual('snake'); // comprueba si el título es el esperado.
  });

  /* Prueba que verifica si el título se renderiza en la vista. */
  it('should render title', () => { // si el componente tiene ese valor..
    const fixture = TestBed.createComponent(MemoramaComponent); // crea una instancia del componente.
    fixture.detectChanges(); // realiza la detección de cambios en el componente.
    const compiled = fixture.nativeElement as HTMLElement; // obtiene el HTML renderizado.
    expect(compiled.querySelector('.content span')?.textContent).toContain('snake app is running!'); // comprueba si el título se muestra correctamente en la vista.
  });
});
