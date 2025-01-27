import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntrianFarmasiComponent } from './antrian-farmasi.component';

describe('AntrianFarmasiComponent', () => {
  let component: AntrianFarmasiComponent;
  let fixture: ComponentFixture<AntrianFarmasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntrianFarmasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AntrianFarmasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
