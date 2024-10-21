import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPurchasingOrderComponent } from './detail-purchasing-order.component';

describe('DetailPurchasingOrderComponent', () => {
  let component: DetailPurchasingOrderComponent;
  let fixture: ComponentFixture<DetailPurchasingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPurchasingOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPurchasingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
