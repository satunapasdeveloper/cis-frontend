import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupMetodePembayaranComponent } from './setup-metode-pembayaran.component';

describe('SetupMetodePembayaranComponent', () => {
  let component: SetupMetodePembayaranComponent;
  let fixture: ComponentFixture<SetupMetodePembayaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupMetodePembayaranComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupMetodePembayaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
