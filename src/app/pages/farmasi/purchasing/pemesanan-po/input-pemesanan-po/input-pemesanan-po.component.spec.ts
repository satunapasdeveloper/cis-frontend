import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPemesananPoComponent } from './input-pemesanan-po.component';

describe('InputPemesananPoComponent', () => {
  let component: InputPemesananPoComponent;
  let fixture: ComponentFixture<InputPemesananPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPemesananPoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputPemesananPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
