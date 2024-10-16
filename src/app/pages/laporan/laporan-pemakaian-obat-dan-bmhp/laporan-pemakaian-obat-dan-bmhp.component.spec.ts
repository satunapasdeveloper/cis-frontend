import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanPemakaianObatDanBmhpComponent } from './laporan-pemakaian-obat-dan-bmhp.component';

describe('LaporanPemakaianObatDanBmhpComponent', () => {
  let component: LaporanPemakaianObatDanBmhpComponent;
  let fixture: ComponentFixture<LaporanPemakaianObatDanBmhpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaporanPemakaianObatDanBmhpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaporanPemakaianObatDanBmhpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
