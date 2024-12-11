import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPendaftaranRawatJalanComponent } from './list-pendaftaran-rawat-jalan.component';

describe('ListPendaftaranRawatJalanComponent', () => {
  let component: ListPendaftaranRawatJalanComponent;
  let fixture: ComponentFixture<ListPendaftaranRawatJalanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPendaftaranRawatJalanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPendaftaranRawatJalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
