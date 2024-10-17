import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupGolonganComponent } from './setup-golongan.component';

describe('SetupGolonganComponent', () => {
  let component: SetupGolonganComponent;
  let fixture: ComponentFixture<SetupGolonganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupGolonganComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupGolonganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
