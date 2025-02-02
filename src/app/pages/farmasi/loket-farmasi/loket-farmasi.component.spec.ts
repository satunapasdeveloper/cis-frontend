import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoketFarmasiComponent } from './loket-farmasi.component';

describe('LoketFarmasiComponent', () => {
  let component: LoketFarmasiComponent;
  let fixture: ComponentFixture<LoketFarmasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoketFarmasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoketFarmasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
