import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupLoketKasirComponent } from './setup-loket-kasir.component';

describe('SetupLoketKasirComponent', () => {
  let component: SetupLoketKasirComponent;
  let fixture: ComponentFixture<SetupLoketKasirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupLoketKasirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupLoketKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
