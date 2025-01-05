import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPlanComponent } from './vp-plan.component';

describe('VpPlanComponent', () => {
  let component: VpPlanComponent;
  let fixture: ComponentFixture<VpPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
