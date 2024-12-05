import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupLoketComponent } from './setup-loket.component';

describe('SetupLoketComponent', () => {
  let component: SetupLoketComponent;
  let fixture: ComponentFixture<SetupLoketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupLoketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupLoketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
