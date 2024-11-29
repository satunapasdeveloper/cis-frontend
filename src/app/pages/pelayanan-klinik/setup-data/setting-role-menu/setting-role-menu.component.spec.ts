import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingRoleMenuComponent } from './setting-role-menu.component';

describe('SettingRoleMenuComponent', () => {
  let component: SettingRoleMenuComponent;
  let fixture: ComponentFixture<SettingRoleMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingRoleMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingRoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
