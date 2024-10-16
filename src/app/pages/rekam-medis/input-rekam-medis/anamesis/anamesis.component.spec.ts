import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnamesisComponent } from './anamesis.component';

describe('AnamesisComponent', () => {
  let component: AnamesisComponent;
  let fixture: ComponentFixture<AnamesisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnamesisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnamesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
