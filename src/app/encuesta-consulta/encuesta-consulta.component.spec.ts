import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaConsultaComponent } from './encuesta-consulta.component';

describe('EncuestaConsultaComponent', () => {
  let component: EncuestaConsultaComponent;
  let fixture: ComponentFixture<EncuestaConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncuestaConsultaComponent]
    });
    fixture = TestBed.createComponent(EncuestaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
