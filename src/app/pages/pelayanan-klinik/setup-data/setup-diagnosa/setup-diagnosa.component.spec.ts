import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDiagnosaComponent } from './setup-diagnosa.component';

describe('SetupDiagnosaComponent', () => {
  let component: SetupDiagnosaComponent;
  let fixture: ComponentFixture<SetupDiagnosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupDiagnosaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupDiagnosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
