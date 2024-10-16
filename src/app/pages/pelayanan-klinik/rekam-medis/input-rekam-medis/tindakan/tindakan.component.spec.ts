import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TindakanComponent } from './tindakan.component';

describe('TindakanComponent', () => {
  let component: TindakanComponent;
  let fixture: ComponentFixture<TindakanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TindakanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TindakanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
