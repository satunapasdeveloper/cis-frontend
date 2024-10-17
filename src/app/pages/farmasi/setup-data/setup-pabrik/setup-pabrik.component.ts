import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupPabrikService } from 'src/app/services/farmasi/setup-data/setup-pabrik.service';
import { SetupPabrikState, SetupPabrikActions } from 'src/app/store/farmasi/setup-data/setup-pabrik';

@Component({
    selector: 'app-setup-pabrik',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        PaginatorModule,
    ],
    templateUrl: './setup-pabrik.component.html',
    styleUrl: './setup-pabrik.component.scss'
})
export class SetupPabrikComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Tambah',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'Setup_Pabrik',
        column: [
            { field: 'kode_manufacture', headerName: 'Kode Pabrik', class: 'font-semibold' },
            { field: 'nama_manufacture', headerName: 'Nama Pabrik', },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama_pabrik',
        searchPlaceholder: 'Cari Nama Pabrik Disini',
        totalRows: 0,
    };
    GridSelectedData: any;

    First: number = 0;

    Rows: number = 10;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    KfaKeywordSearch$ = new BehaviorSubject(null);

    constructor(
        private _store: Store,
        private _messageService: MessageService,
        private _pabrikService: SetupPabrikService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_pabrik',
            fields: [
                {
                    id: 'kode_manufacture',
                    label: 'Kode Pabrik',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'nama_manufacture',
                    label: 'Nama Pabrik',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'id_manufacture',
                    label: 'Id Pabrik',
                    hidden: true,
                    required: false,
                    type: 'text',
                    value: "",
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupPabrikState.pabrikEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("get data from setup pabrik =>", result);
                    this.GridProps.dataSource = result.entities;
                    this.GridProps.totalRows = result.totalRows;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };
    }

    handleBackToList() {
        this.FormComps.onResetForm();

        setTimeout(() => {
            this.PageState = 'list';
            this.FormState = 'insert';
            this.ButtonNavigation = [
                {
                    id: 'add',
                    title: 'Tambah',
                    icon: 'pi pi-plus'
                }
            ];
        }, 100);
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            setTimeout(() => {
                this.FormComps.FormGroup.patchValue(args);
            }, 500);
        }, 100);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'delete') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data yang dihapus tidak bisa dikembalikan',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya Saya Yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak, Kembali',
                accept: () => {
                    this.deletePabrik(args.data.uuid);
                }
            });
        }

        if (args.type == 'ubah status') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data akan diubah statusnya',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya Saya Yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak, Kembali',
                accept: () => {
                    this.updateStatusPabrik(args.data.id_pabrik);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any): void {
        this._store
            .dispatch(new SetupPabrikActions.GetAllPabrik({ count: args.rows, page: args.page + 1 }))
            .pipe(takeUntil(this.Destroy$));
    }

    savePabrik(data: any) {
        this._store
            .dispatch(new SetupPabrikActions.CreatePabrik(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_pabrik.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updatePabrik(data: any) {
        this._store
            .dispatch(new SetupPabrikActions.UpdatePabrik(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_pabrik.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusPabrik(uuid: string) {
        // this._store
        //     .dispatch(new SetupPabrikActions.UpdateStatusPabrik(uuid))
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.setup_pabrik.success) {
        //             this._messageService.clear();
        //             this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
        //             this.handleBackToList();
        //         }
        //     })
    }

    private deletePabrik(uuid: string) {
        this._store
            .dispatch(new SetupPabrikActions.DeletePabrik(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_pabrik.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }

}
