import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturKonsinyasiComponent } from './detail-retur-konsinyasi.component';

describe('DetailReturKonsinyasiComponent', () => {
  let component: DetailReturKonsinyasiComponent;
  let fixture: ComponentFixture<DetailReturKonsinyasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailReturKonsinyasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailReturKonsinyasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
