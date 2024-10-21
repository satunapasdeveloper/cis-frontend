import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPenerimaanKonsinyasiComponent } from './detail-penerimaan-konsinyasi.component';

describe('DetailPenerimaanKonsinyasiComponent', () => {
  let component: DetailPenerimaanKonsinyasiComponent;
  let fixture: ComponentFixture<DetailPenerimaanKonsinyasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPenerimaanKonsinyasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPenerimaanKonsinyasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
