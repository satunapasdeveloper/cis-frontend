import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPurchasingOrderComponent } from './history-purchasing-order.component';

describe('HistoryPurchasingOrderComponent', () => {
  let component: HistoryPurchasingOrderComponent;
  let fixture: ComponentFixture<HistoryPurchasingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPurchasingOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPurchasingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
