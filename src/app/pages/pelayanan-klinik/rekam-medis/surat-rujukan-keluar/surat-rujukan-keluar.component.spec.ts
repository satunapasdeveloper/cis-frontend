import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratRujukanKeluarComponent } from './surat-rujukan-keluar.component';

describe('SuratRujukanKeluarComponent', () => {
  let component: SuratRujukanKeluarComponent;
  let fixture: ComponentFixture<SuratRujukanKeluarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuratRujukanKeluarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuratRujukanKeluarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
