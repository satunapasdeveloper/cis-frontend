import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupKelompokTarifComponent } from './setup-kelompok-tarif.component';

describe('SetupKelompokTarifComponent', () => {
  let component: SetupKelompokTarifComponent;
  let fixture: ComponentFixture<SetupKelompokTarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupKelompokTarifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupKelompokTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
