import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPlanProcedureComponent } from './vp-plan-procedure.component';

describe('VpPlanProcedureComponent', () => {
  let component: VpPlanProcedureComponent;
  let fixture: ComponentFixture<VpPlanProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpPlanProcedureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpPlanProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
