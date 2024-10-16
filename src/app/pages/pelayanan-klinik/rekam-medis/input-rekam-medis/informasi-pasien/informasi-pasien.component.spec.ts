import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformasiPasienComponent } from './informasi-pasien.component';

describe('InformasiPasienComponent', () => {
  let component: InformasiPasienComponent;
  let fixture: ComponentFixture<InformasiPasienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformasiPasienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformasiPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
