import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PemeriksaanFisikComponent } from './pemeriksaan-fisik.component';

describe('PemeriksaanFisikComponent', () => {
  let component: PemeriksaanFisikComponent;
  let fixture: ComponentFixture<PemeriksaanFisikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PemeriksaanFisikComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PemeriksaanFisikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
