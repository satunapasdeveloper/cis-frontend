import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputReturPembelianComponent } from './input-retur-pembelian.component';

describe('InputReturPembelianComponent', () => {
  let component: InputReturPembelianComponent;
  let fixture: ComponentFixture<InputReturPembelianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputReturPembelianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputReturPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
