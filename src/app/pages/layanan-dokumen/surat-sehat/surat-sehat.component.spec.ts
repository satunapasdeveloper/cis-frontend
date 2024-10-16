import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratSehatComponent } from './surat-sehat.component';

describe('SuratSehatComponent', () => {
  let component: SuratSehatComponent;
  let fixture: ComponentFixture<SuratSehatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratSehatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratSehatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
