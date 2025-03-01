import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CroscekTutupKasirComponent } from './croscek-tutup-kasir.component';

describe('CroscekTutupKasirComponent', () => {
  let component: CroscekTutupKasirComponent;
  let fixture: ComponentFixture<CroscekTutupKasirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CroscekTutupKasirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CroscekTutupKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
