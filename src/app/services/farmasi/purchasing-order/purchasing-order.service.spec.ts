import { TestBed } from '@angular/core/testing';

import { PurchasingOrderService } from './purchasing-order.service';

describe('PurchasingOrderService', () => {
  let service: PurchasingOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasingOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
