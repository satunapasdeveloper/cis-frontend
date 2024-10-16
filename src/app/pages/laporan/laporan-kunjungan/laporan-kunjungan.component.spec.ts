import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanKunjunganComponent } from './laporan-kunjungan.component';

describe('LaporanKunjunganComponent', () => {
  let component: LaporanKunjunganComponent;
  let fixture: ComponentFixture<LaporanKunjunganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaporanKunjunganComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaporanKunjunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
