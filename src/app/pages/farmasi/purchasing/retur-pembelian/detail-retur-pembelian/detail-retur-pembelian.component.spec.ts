import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturPembelianComponent } from './detail-retur-pembelian.component';

describe('DetailReturPembelianComponent', () => {
  let component: DetailReturPembelianComponent;
  let fixture: ComponentFixture<DetailReturPembelianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailReturPembelianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailReturPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
