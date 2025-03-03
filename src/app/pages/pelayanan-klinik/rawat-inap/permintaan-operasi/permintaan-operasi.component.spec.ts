import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermintaanOperasiComponent } from './permintaan-operasi.component';

describe('PermintaanOperasiComponent', () => {
  let component: PermintaanOperasiComponent;
  let fixture: ComponentFixture<PermintaanOperasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermintaanOperasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermintaanOperasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
