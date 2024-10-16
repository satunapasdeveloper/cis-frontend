import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanKunjunganHarianComponent } from './laporan-kunjungan-harian.component';

describe('LaporanKunjunganHarianComponent', () => {
  let component: LaporanKunjunganHarianComponent;
  let fixture: ComponentFixture<LaporanKunjunganHarianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaporanKunjunganHarianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaporanKunjunganHarianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
