import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPlanOrderLabComponent } from './vp-plan-order-lab.component';

describe('VpPlanOrderLabComponent', () => {
  let component: VpPlanOrderLabComponent;
  let fixture: ComponentFixture<VpPlanOrderLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpPlanOrderLabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpPlanOrderLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
