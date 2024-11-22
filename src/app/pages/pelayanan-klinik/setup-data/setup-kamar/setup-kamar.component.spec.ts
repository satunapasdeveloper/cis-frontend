import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupKamarComponent } from './setup-kamar.component';

describe('SetupKamarComponent', () => {
  let component: SetupKamarComponent;
  let fixture: ComponentFixture<SetupKamarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupKamarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupKamarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
