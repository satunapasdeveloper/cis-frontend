import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupRencanaOperasiComponent } from './setup-rencana-operasi.component';

describe('SetupRencanaOperasiComponent', () => {
  let component: SetupRencanaOperasiComponent;
  let fixture: ComponentFixture<SetupRencanaOperasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupRencanaOperasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupRencanaOperasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
