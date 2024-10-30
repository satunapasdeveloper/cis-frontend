import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputReturKonsinyasiComponent } from './input-retur-konsinyasi.component';

describe('InputReturKonsinyasiComponent', () => {
  let component: InputReturKonsinyasiComponent;
  let fixture: ComponentFixture<InputReturKonsinyasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputReturKonsinyasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputReturKonsinyasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
