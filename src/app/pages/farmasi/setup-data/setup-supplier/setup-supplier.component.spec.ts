import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupSupplierComponent } from './setup-supplier.component';

describe('SetupSupplierComponent', () => {
  let component: SetupSupplierComponent;
  let fixture: ComponentFixture<SetupSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupSupplierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
