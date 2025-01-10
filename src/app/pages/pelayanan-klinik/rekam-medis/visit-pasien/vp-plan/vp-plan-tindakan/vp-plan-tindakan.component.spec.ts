import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPlanTindakanComponent } from './vp-plan-tindakan.component';

describe('VpPlanTindakanComponent', () => {
  let component: VpPlanTindakanComponent;
  let fixture: ComponentFixture<VpPlanTindakanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpPlanTindakanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpPlanTindakanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
