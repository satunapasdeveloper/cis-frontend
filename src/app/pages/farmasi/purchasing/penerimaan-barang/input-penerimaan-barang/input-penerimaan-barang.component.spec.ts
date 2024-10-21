import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPenerimaanBarangComponent } from './input-penerimaan-barang.component';

describe('InputPenerimaanBarangComponent', () => {
  let component: InputPenerimaanBarangComponent;
  let fixture: ComponentFixture<InputPenerimaanBarangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPenerimaanBarangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputPenerimaanBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
