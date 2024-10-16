import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratSakitComponent } from './surat-sakit.component';

describe('SuratSakitComponent', () => {
  let component: SuratSakitComponent;
  let fixture: ComponentFixture<SuratSakitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratSakitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratSakitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
