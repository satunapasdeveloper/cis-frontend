import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPlanBmhpComponent } from './vp-plan-bmhp.component';

describe('VpPlanBmhpComponent', () => {
  let component: VpPlanBmhpComponent;
  let fixture: ComponentFixture<VpPlanBmhpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpPlanBmhpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpPlanBmhpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
