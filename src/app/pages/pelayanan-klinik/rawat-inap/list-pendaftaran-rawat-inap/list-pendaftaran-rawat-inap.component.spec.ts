import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPendaftaranRawatInapComponent } from './list-pendaftaran-rawat-inap.component';

describe('ListPendaftaranRawatInapComponent', () => {
  let component: ListPendaftaranRawatInapComponent;
  let fixture: ComponentFixture<ListPendaftaranRawatInapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPendaftaranRawatInapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPendaftaranRawatInapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
