import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPurchasingOrderComponent } from './input-purchasing-order.component';

describe('InputPurchasingOrderComponent', () => {
  let component: InputPurchasingOrderComponent;
  let fixture: ComponentFixture<InputPurchasingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPurchasingOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputPurchasingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
