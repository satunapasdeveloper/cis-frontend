import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyerahanResepComponent } from './penyerahan-resep.component';

describe('PenyerahanResepComponent', () => {
  let component: PenyerahanResepComponent;
  let fixture: ComponentFixture<PenyerahanResepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenyerahanResepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenyerahanResepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
