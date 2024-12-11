import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendaftaranRawatJalanComponent } from './pendaftaran-rawat-jalan.component';

describe('PendaftaranRawatJalanComponent', () => {
  let component: PendaftaranRawatJalanComponent;
  let fixture: ComponentFixture<PendaftaranRawatJalanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendaftaranRawatJalanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendaftaranRawatJalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
