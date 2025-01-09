import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupGroupItemComponent } from './setup-group-item.component';

describe('SetupGroupItemComponent', () => {
  let component: SetupGroupItemComponent;
  let fixture: ComponentFixture<SetupGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupGroupItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
