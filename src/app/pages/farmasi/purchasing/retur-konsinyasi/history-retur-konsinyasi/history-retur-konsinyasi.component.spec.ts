import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryReturKonsinyasiComponent } from './history-retur-konsinyasi.component';

describe('HistoryReturKonsinyasiComponent', () => {
  let component: HistoryReturKonsinyasiComponent;
  let fixture: ComponentFixture<HistoryReturKonsinyasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryReturKonsinyasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryReturKonsinyasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
