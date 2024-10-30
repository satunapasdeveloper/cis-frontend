import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPemesananPoComponent } from './detail-pemesanan-po.component';

describe('DetailPemesananPoComponent', () => {
  let component: DetailPemesananPoComponent;
  let fixture: ComponentFixture<DetailPemesananPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPemesananPoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPemesananPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
