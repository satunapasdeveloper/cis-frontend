import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupJabatanComponent } from './setup-jabatan.component';

describe('SetupJabatanComponent', () => {
  let component: SetupJabatanComponent;
  let fixture: ComponentFixture<SetupJabatanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupJabatanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupJabatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
