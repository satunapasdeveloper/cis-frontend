import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPenerimaanKonsinyasiComponent } from './history-penerimaan-konsinyasi.component';

describe('HistoryPenerimaanKonsinyasiComponent', () => {
  let component: HistoryPenerimaanKonsinyasiComponent;
  let fixture: ComponentFixture<HistoryPenerimaanKonsinyasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPenerimaanKonsinyasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPenerimaanKonsinyasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
