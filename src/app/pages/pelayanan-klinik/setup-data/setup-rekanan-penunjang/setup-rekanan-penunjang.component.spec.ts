import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupRekananPenunjangComponent } from './setup-rekanan-penunjang.component';

describe('SetupRekananPenunjangComponent', () => {
  let component: SetupRekananPenunjangComponent;
  let fixture: ComponentFixture<SetupRekananPenunjangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupRekananPenunjangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupRekananPenunjangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
