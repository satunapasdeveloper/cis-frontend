import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoicePasienComponent } from './list-invoice-pasien.component';

describe('ListInvoicePasienComponent', () => {
  let component: ListInvoicePasienComponent;
  let fixture: ComponentFixture<ListInvoicePasienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInvoicePasienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListInvoicePasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
