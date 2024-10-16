import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiwayatRekamMedisComponent } from './riwayat-rekam-medis.component';

describe('RiwayatRekamMedisComponent', () => {
  let component: RiwayatRekamMedisComponent;
  let fixture: ComponentFixture<RiwayatRekamMedisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiwayatRekamMedisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiwayatRekamMedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
