import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPemesananPoComponent } from './history-pemesanan-po.component';

describe('HistoryPemesananPoComponent', () => {
  let component: HistoryPemesananPoComponent;
  let fixture: ComponentFixture<HistoryPemesananPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPemesananPoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPemesananPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
