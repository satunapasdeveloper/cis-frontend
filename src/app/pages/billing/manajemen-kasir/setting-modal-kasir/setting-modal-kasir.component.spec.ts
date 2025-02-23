import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingModalKasirComponent } from './setting-modal-kasir.component';

describe('SettingModalKasirComponent', () => {
  let component: SettingModalKasirComponent;
  let fixture: ComponentFixture<SettingModalKasirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingModalKasirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingModalKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
