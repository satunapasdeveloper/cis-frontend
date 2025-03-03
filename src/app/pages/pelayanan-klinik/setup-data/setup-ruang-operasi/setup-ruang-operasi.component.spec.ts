import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupRuangOperasiComponent } from './setup-ruang-operasi.component';

describe('SetupRuangOperasiComponent', () => {
  let component: SetupRuangOperasiComponent;
  let fixture: ComponentFixture<SetupRuangOperasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupRuangOperasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupRuangOperasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
