import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendaftaranRawatInapComponent } from './pendaftaran-rawat-inap.component';

describe('PendaftaranRawatInapComponent', () => {
  let component: PendaftaranRawatInapComponent;
  let fixture: ComponentFixture<PendaftaranRawatInapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendaftaranRawatInapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendaftaranRawatInapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
