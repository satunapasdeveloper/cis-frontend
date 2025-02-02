import { TestBed } from '@angular/core/testing';

import { PenjualanObatService } from './penjualan-obat.service';

describe('PenjualanObatService', () => {
  let service: PenjualanObatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenjualanObatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
