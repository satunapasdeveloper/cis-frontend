import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTempatTidurComponent } from './transfer-tempat-tidur.component';

describe('TransferTempatTidurComponent', () => {
  let component: TransferTempatTidurComponent;
  let fixture: ComponentFixture<TransferTempatTidurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferTempatTidurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferTempatTidurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
