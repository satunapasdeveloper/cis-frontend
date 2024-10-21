import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryReturPembelianComponent } from './history-retur-pembelian.component';

describe('HistoryReturPembelianComponent', () => {
  let component: HistoryReturPembelianComponent;
  let fixture: ComponentFixture<HistoryReturPembelianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryReturPembelianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryReturPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
