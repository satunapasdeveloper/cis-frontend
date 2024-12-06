import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManajemenAntrianComponent } from './manajemen-antrian.component';

describe('ManajemenAntrianComponent', () => {
  let component: ManajemenAntrianComponent;
  let fixture: ComponentFixture<ManajemenAntrianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManajemenAntrianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManajemenAntrianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
