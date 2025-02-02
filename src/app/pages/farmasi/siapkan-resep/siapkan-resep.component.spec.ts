import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiapkanResepComponent } from './siapkan-resep.component';

describe('SiapkanResepComponent', () => {
  let component: SiapkanResepComponent;
  let fixture: ComponentFixture<SiapkanResepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiapkanResepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiapkanResepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
