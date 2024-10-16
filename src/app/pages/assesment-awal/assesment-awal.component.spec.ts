import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentAwalComponent } from './assesment-awal.component';

describe('AssesmentAwalComponent', () => {
  let component: AssesmentAwalComponent;
  let fixture: ComponentFixture<AssesmentAwalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesmentAwalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssesmentAwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
