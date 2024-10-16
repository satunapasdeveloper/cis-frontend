import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanPenyakitComponent } from './laporan-penyakit.component';

describe('LaporanPenyakitComponent', () => {
  let component: LaporanPenyakitComponent;
  let fixture: ComponentFixture<LaporanPenyakitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaporanPenyakitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaporanPenyakitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
