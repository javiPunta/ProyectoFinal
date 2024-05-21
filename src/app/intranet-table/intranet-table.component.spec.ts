import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntranetTableComponent } from './intranet-table.component';

describe('IntranetTableComponent', () => {
  let component: IntranetTableComponent;
  let fixture: ComponentFixture<IntranetTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntranetTableComponent]
    });
    fixture = TestBed.createComponent(IntranetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
