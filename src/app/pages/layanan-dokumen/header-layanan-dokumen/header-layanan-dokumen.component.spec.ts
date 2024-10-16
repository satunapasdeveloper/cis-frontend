import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLayananDokumenComponent } from './header-layanan-dokumen.component';

describe('HeaderLayananDokumenComponent', () => {
  let component: HeaderLayananDokumenComponent;
  let fixture: ComponentFixture<HeaderLayananDokumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLayananDokumenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderLayananDokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
