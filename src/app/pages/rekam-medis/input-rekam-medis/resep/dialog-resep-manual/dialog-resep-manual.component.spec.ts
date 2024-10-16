import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResepManualComponent } from './dialog-resep-manual.component';

describe('DialogResepManualComponent', () => {
  let component: DialogResepManualComponent;
  let fixture: ComponentFixture<DialogResepManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogResepManualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogResepManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
