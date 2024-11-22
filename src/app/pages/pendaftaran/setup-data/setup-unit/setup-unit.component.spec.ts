import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupUnitComponent } from './setup-unit.component';

describe('SetupUnitComponent', () => {
  let component: SetupUnitComponent;
  let fixture: ComponentFixture<SetupUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupUnitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
