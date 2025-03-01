import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBillingPasienComponent } from './input-billing-pasien.component';

describe('InputBillingPasienComponent', () => {
  let component: InputBillingPasienComponent;
  let fixture: ComponentFixture<InputBillingPasienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputBillingPasienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputBillingPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
