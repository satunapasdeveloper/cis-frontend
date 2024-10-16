import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TambahAntrianComponent } from './tambah-antrian.component';

describe('TambahAntrianComponent', () => {
  let component: TambahAntrianComponent;
  let fixture: ComponentFixture<TambahAntrianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TambahAntrianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TambahAntrianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
