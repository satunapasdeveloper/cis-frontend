import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResepNonRacikanComponent } from './dialog-resep-non-racikan.component';

describe('DialogResepNonRacikanComponent', () => {
  let component: DialogResepNonRacikanComponent;
  let fixture: ComponentFixture<DialogResepNonRacikanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogResepNonRacikanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogResepNonRacikanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
