import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResepRacikanComponent } from './dialog-resep-racikan.component';

describe('DialogResepRacikanComponent', () => {
  let component: DialogResepRacikanComponent;
  let fixture: ComponentFixture<DialogResepRacikanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogResepRacikanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogResepRacikanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
