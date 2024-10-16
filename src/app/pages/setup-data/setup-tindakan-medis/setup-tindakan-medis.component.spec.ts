import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTindakanMedisComponent } from './setup-tindakan-medis.component';

describe('SetupTindakanMedisComponent', () => {
  let component: SetupTindakanMedisComponent;
  let fixture: ComponentFixture<SetupTindakanMedisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupTindakanMedisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupTindakanMedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
