import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCaraPulangComponent } from './setup-cara-pulang.component';

describe('SetupCaraPulangComponent', () => {
  let component: SetupCaraPulangComponent;
  let fixture: ComponentFixture<SetupCaraPulangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupCaraPulangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupCaraPulangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
