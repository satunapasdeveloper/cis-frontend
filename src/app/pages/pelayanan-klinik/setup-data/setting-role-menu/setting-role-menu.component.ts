import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Subject, takeUntil, map } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { RoleModel } from 'src/app/model/pages/setup-data/role.model';
import { SettingRoleMenuService } from 'src/app/services/pelayanan-klinik/setup-data/setting-role-menu.service';
import { SetupRoleActions, SetupRoleState } from 'src/app/store/setup-data/role';

@Component({
    selector: 'app-setting-role-menu',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        OverlayPanelModule,
    ],
    templateUrl: './setting-role-menu.component.html',
    styleUrl: './setting-role-menu.component.scss'
})
export class SettingRoleMenuComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    RoleDatasource: RoleModel.IRole[] = [];

    RoleMenuDatasource: any[] = [];

    constructor(
        private _store: Store,
        private _messageService: MessageService,
        private _settingRoleMenuService: SettingRoleMenuService,
    ) { }

    ngOnInit(): void {
        this.getAllRole();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAllRole() {
        this._store
            .select(SetupRoleState.roleActives)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result?.length) {
                    this.RoleDatasource = result;
                } else {
                    this._store
                        .dispatch(new SetupRoleActions.GetAllActiveRole({ page: 1, count: 100 }))
                        .pipe(takeUntil(this.Destroy$))
                        .subscribe((result) => {
                            if (result.setup_role.actives) {
                                console.log(result.setup_role);
                                this.RoleDatasource = result.setup_role.actives;
                            }
                        })
                }
            })
    }

    getMenuByRole(id_role: any) {
        this._settingRoleMenuService
            .getAll(id_role)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.RoleMenuDatasource = result.data as any;
            })
    }

    handleChangeStatusAssign(is_assigned: boolean, id_menu: number, id_role: number, id_role_menu?: number) {
        if (is_assigned) {
            this.onDeleteRoleMenu(id_role, id_role_menu!);
        } else {
            this.onCreateRoleMenu(id_role, id_menu);
        }
    }

    private onCreateRoleMenu(id_role: number, id_menu: number) {
        this._settingRoleMenuService
            .create({ id_role: id_role, id_menu: id_menu })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.getMenuByRole(id_role)
                }
            })
    }

    private onDeleteRoleMenu(id_role: number, id_role_menu: number) {
        this._settingRoleMenuService
            .delete(id_role_menu)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.getMenuByRole(id_role)
                }
            })
    }
}
