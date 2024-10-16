import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRekamMedisComponent } from './input-rekam-medis.component';

describe('InputRekamMedisComponent', () => {
  let component: InputRekamMedisComponent;
  let fixture: ComponentFixture<InputRekamMedisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputRekamMedisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputRekamMedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
