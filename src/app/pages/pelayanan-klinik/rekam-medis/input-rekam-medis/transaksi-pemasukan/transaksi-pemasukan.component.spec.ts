import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksiPemasukanComponent } from './transaksi-pemasukan.component';

describe('TransaksiPemasukanComponent', () => {
  let component: TransaksiPemasukanComponent;
  let fixture: ComponentFixture<TransaksiPemasukanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaksiPemasukanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransaksiPemasukanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
