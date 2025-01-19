import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHasilOrderComponent } from './input-hasil-order.component';

describe('InputHasilOrderComponent', () => {
  let component: InputHasilOrderComponent;
  let fixture: ComponentFixture<InputHasilOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputHasilOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputHasilOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
