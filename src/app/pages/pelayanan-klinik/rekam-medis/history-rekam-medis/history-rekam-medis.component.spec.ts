import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryRekamMedisComponent } from './history-rekam-medis.component';

describe('HistoryRekamMedisComponent', () => {
  let component: HistoryRekamMedisComponent;
  let fixture: ComponentFixture<HistoryRekamMedisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryRekamMedisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryRekamMedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
