import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupKelasComponent } from './setup-kelas.component';

describe('SetupKelasComponent', () => {
  let component: SetupKelasComponent;
  let fixture: ComponentFixture<SetupKelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupKelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupKelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
