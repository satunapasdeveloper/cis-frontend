import { TestBed } from '@angular/core/testing';

import { TelaahResepService } from './telaah-resep.service';

describe('TelaahResepService', () => {
  let service: TelaahResepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelaahResepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
