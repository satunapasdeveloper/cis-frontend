import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPlanOrderRadComponent } from './vp-plan-order-rad.component';

describe('VpPlanOrderRadComponent', () => {
  let component: VpPlanOrderRadComponent;
  let fixture: ComponentFixture<VpPlanOrderRadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpPlanOrderRadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpPlanOrderRadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
