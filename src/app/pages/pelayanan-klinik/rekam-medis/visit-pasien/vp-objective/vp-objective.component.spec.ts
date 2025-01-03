import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpObjectiveComponent } from './vp-objective.component';

describe('VpObjectiveComponent', () => {
  let component: VpObjectiveComponent;
  let fixture: ComponentFixture<VpObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpObjectiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
