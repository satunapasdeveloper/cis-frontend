import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPenjualanObatComponent } from './history-penjualan-obat.component';

describe('HistoryPenjualanObatComponent', () => {
  let component: HistoryPenjualanObatComponent;
  let fixture: ComponentFixture<HistoryPenjualanObatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPenjualanObatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPenjualanObatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
