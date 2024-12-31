import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTarifComponent } from './setup-tarif.component';

describe('SetupTarifComponent', () => {
  let component: SetupTarifComponent;
  let fixture: ComponentFixture<SetupTarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupTarifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
