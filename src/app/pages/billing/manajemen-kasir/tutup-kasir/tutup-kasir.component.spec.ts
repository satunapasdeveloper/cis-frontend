import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutupKasirComponent } from './tutup-kasir.component';

describe('TutupKasirComponent', () => {
  let component: TutupKasirComponent;
  let fixture: ComponentFixture<TutupKasirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutupKasirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutupKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
