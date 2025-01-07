import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupStockroomComponent } from './setup-stockroom.component';

describe('SetupStockroomComponent', () => {
  let component: SetupStockroomComponent;
  let fixture: ComponentFixture<SetupStockroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupStockroomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupStockroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
