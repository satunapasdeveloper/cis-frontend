import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupGedungOperasiComponent } from './setup-gedung-operasi.component';

describe('SetupGedungOperasiComponent', () => {
  let component: SetupGedungOperasiComponent;
  let fixture: ComponentFixture<SetupGedungOperasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupGedungOperasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupGedungOperasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
