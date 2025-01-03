import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseVisitPasienComponent } from './base-visit-pasien.component';

describe('BaseVisitPasienComponent', () => {
  let component: BaseVisitPasienComponent;
  let fixture: ComponentFixture<BaseVisitPasienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseVisitPasienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseVisitPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
