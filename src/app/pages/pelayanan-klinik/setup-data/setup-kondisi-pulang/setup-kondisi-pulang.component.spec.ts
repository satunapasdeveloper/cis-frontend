import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupKondisiPulangComponent } from './setup-kondisi-pulang.component';

describe('SetupKondisiPulangComponent', () => {
  let component: SetupKondisiPulangComponent;
  let fixture: ComponentFixture<SetupKondisiPulangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupKondisiPulangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupKondisiPulangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
