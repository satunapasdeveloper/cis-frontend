import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLaporanComponent } from './header-laporan.component';

describe('HeaderLaporanComponent', () => {
  let component: HeaderLaporanComponent;
  let fixture: ComponentFixture<HeaderLaporanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLaporanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
