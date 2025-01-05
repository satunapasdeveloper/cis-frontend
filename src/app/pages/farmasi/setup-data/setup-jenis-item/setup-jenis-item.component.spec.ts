import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupJenisItemComponent } from './setup-jenis-item.component';

describe('SetupJenisItemComponent', () => {
  let component: SetupJenisItemComponent;
  let fixture: ComponentFixture<SetupJenisItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupJenisItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupJenisItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
