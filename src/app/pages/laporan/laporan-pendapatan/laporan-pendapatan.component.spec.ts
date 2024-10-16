import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanPendapatanComponent } from './laporan-pendapatan.component';

describe('LaporanPendapatanComponent', () => {
  let component: LaporanPendapatanComponent;
  let fixture: ComponentFixture<LaporanPendapatanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaporanPendapatanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaporanPendapatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
