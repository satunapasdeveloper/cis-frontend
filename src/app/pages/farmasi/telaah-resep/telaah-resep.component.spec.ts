import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaahResepComponent } from './telaah-resep.component';

describe('TelaahResepComponent', () => {
  let component: TelaahResepComponent;
  let fixture: ComponentFixture<TelaahResepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaahResepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TelaahResepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
