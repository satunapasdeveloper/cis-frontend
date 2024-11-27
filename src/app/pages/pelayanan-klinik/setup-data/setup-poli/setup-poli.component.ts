import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupPoliActions, SetupPoliState } from 'src/app/store/setup-data/setup-poli';
import { SetupUnitState } from 'src/app/store/setup-data/unit';

@Component({
    selector: 'app-setup-poli',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-poli.component.html',
    styleUrl: './setup-poli.component.scss'
})
export class SetupPoliComponent implements OnInit, OnDestroy {

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
        id: 'Setup_Poli',
        column: [
            { field: 'kode_poli', headerName: 'Kode Poli', class: 'text-blue-500 font-semibold' },
            { field: 'nama_poli', headerName: 'Nama Poli', },
            { field: 'nama_unit', headerName: 'Nama Unit', },
            { field: 'kode_poli_bpjs', headerName: 'Kode Poli BPJS', },
            { field: 'id_poli_satu_sehat', headerName: 'Poli Satu Sehat', },
            { field: 'is_active', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Status', 'Detail'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'id_unit',
                placeholder: 'Cari Nama Unit Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'name',
                    optionValue: 'value',
                    autoDisplayFirst: false
                }
            },
            {
                id: 'kode_poli',
                placeholder: 'Cari Kode Poli Disini',
                type: 'text'
            },
            {
                id: 'nama_poli',
                placeholder: 'Cari Nama Poli Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'poli',
        searchPlaceholder: 'Cari Nama Poli Disini',
        totalRows: 0
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _store: Store,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_poli',
            fields: [
                {
                    id: 'id_poli',
                    label: 'Kode Poli',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'kode_poli',
                    label: 'Kode Poli',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_poli',
                    label: 'Nama Poli',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_unit',
                    label: 'Unit',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'kode_poli_bpjs',
                    label: 'Kode Poli BPJS',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_poli_satu_sehat',
                    label: 'Id Poli Satu Sehat',
                    required: true,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllUnit();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupPoliState.poliState)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.entities;
                    this.GridProps.totalRows = result.totalRows;
                }
            });
    }

    private getAllUnit() {
        this._store
            .select(SetupUnitState.unitEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_unit');
                    const data = result.map((item: any) => {
                        return {
                            name: item.nama_unit,
                            value: item.id_unit
                        }
                    });

                    this.FormProps.fields[index].dropdownProps.options = data;

                    this.GridProps.customSearchProps![0].dropdownProps!.options = data;
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
                    this.updateStatusPoli(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this._store.dispatch(new SetupPoliActions.GetAllPoli({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this._store.dispatch(new SetupPoliActions.GetAllPoli({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    savePoli(data: any) {
        this._store
            .dispatch(new SetupPoliActions.CreatePoli(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_poli.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updatePoli(data: any) {
        this._store
            .dispatch(new SetupPoliActions.UpdatePoli(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_poli.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusPoli(data: any) {
        this._store
            .dispatch(new SetupPoliActions.UpdateStatusPoli(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_poli.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }
}
