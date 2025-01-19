import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenjadwalanComponent } from './penjadwalan.component';

describe('PenjadwalanComponent', () => {
  let component: PenjadwalanComponent;
  let fixture: ComponentFixture<PenjadwalanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenjadwalanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenjadwalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
