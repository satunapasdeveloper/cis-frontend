import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmhpComponent } from './bmhp.component';

describe('BmhpComponent', () => {
  let component: BmhpComponent;
  let fixture: ComponentFixture<BmhpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmhpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BmhpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
