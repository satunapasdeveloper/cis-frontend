import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratPerintahRawatInapComponent } from './surat-perintah-rawat-inap.component';

describe('SuratPerintahRawatInapComponent', () => {
  let component: SuratPerintahRawatInapComponent;
  let fixture: ComponentFixture<SuratPerintahRawatInapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratPerintahRawatInapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratPerintahRawatInapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
