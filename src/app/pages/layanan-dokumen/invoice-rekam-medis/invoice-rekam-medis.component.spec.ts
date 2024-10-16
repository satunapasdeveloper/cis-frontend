import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRekamMedisComponent } from './invoice-rekam-medis.component';

describe('InvoiceRekamMedisComponent', () => {
  let component: InvoiceRekamMedisComponent;
  let fixture: ComponentFixture<InvoiceRekamMedisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceRekamMedisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceRekamMedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
