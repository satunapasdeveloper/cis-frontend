import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupRutePemberianObatComponent } from './setup-rute-pemberian-obat.component';

describe('SetupRutePemberianObatComponent', () => {
  let component: SetupRutePemberianObatComponent;
  let fixture: ComponentFixture<SetupRutePemberianObatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupRutePemberianObatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupRutePemberianObatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
