import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPlanResepComponent } from './vp-plan-resep.component';

describe('VpPlanResepComponent', () => {
  let component: VpPlanResepComponent;
  let fixture: ComponentFixture<VpPlanResepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpPlanResepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpPlanResepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
