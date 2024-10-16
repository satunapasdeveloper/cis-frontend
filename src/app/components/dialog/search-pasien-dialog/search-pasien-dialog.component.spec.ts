import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPasienDialogComponent } from './search-pasien-dialog.component';

describe('SearchPasienDialogComponent', () => {
  let component: SearchPasienDialogComponent;
  let fixture: ComponentFixture<SearchPasienDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPasienDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchPasienDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
