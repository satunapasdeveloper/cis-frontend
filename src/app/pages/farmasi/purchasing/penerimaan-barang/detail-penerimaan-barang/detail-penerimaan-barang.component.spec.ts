import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPenerimaanBarangComponent } from './detail-penerimaan-barang.component';

describe('DetailPenerimaanBarangComponent', () => {
  let component: DetailPenerimaanBarangComponent;
  let fixture: ComponentFixture<DetailPenerimaanBarangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPenerimaanBarangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPenerimaanBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
