import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneradorTicketsComponent } from './generador-tickets.component';

describe('GeneradorTicketsComponent', () => {
  let component: GeneradorTicketsComponent;
  let fixture: ComponentFixture<GeneradorTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneradorTicketsComponent]
    });
    fixture = TestBed.createComponent(GeneradorTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
