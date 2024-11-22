import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPenjaminComponent } from './setup-penjamin.component';

describe('SetupPenjaminComponent', () => {
  let component: SetupPenjaminComponent;
  let fixture: ComponentFixture<SetupPenjaminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupPenjaminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupPenjaminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
