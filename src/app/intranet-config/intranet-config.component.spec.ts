import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntranetConfigComponent } from './intranet-config.component';

describe('IntranetConfigComponent', () => {
  let component: IntranetConfigComponent;
  let fixture: ComponentFixture<IntranetConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntranetConfigComponent]
    });
    fixture = TestBed.createComponent(IntranetConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
