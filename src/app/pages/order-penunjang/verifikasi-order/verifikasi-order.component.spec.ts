import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifikasiOrderComponent } from './verifikasi-order.component';

describe('VerifikasiOrderComponent', () => {
  let component: VerifikasiOrderComponent;
  let fixture: ComponentFixture<VerifikasiOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifikasiOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifikasiOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
