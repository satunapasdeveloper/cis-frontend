import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpAssesmentComponent } from './vp-assesment.component';

describe('VpAssesmentComponent', () => {
  let component: VpAssesmentComponent;
  let fixture: ComponentFixture<VpAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpAssesmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
