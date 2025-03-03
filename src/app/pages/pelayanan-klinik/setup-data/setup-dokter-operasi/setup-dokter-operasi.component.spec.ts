import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDokterOperasiComponent } from './setup-dokter-operasi.component';

describe('SetupDokterOperasiComponent', () => {
  let component: SetupDokterOperasiComponent;
  let fixture: ComponentFixture<SetupDokterOperasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupDokterOperasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupDokterOperasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
