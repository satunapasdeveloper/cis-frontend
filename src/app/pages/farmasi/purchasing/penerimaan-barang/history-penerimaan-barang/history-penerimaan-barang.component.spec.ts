import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPenerimaanBarangComponent } from './history-penerimaan-barang.component';

describe('HistoryPenerimaanBarangComponent', () => {
  let component: HistoryPenerimaanBarangComponent;
  let fixture: ComponentFixture<HistoryPenerimaanBarangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPenerimaanBarangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPenerimaanBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
