import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpSubjectiveComponent } from './vp-subjective.component';

describe('VpSubjectiveComponent', () => {
  let component: VpSubjectiveComponent;
  let fixture: ComponentFixture<VpSubjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpSubjectiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VpSubjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
