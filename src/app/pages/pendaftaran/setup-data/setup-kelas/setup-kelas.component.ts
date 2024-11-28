import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupKelasActions, SetupKelasState } from 'src/app/store/setup-data/kelas';

@Component({
    selector: 'app-setup-kelas',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-kelas.component.html',
    styleUrl: './setup-kelas.component.scss'
})
export class SetupKelasComponent implements OnInit, OnDestroy {

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
        id: 'SetupKelas',
        column: [
            { field: 'nama_kelas', headerName: 'Nama Kelas', class: 'text-blue-500 font-semibold' },
            { field: 'kode_kelas', headerName: 'Kode Kelas', },
            { field: 'kode_kelas_bpjs', headerName: 'Kode Kelas BPJS', },
            { field: 'id_kelas_satu_sehat', headerName: 'Kelas Satu Sehat', },
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
                id: 'nama_kelas',
                placeholder: 'Cari Nama Kelas Disini',
                type: 'text'
            },
            {
                id: 'kode_kelas',
                placeholder: 'Cari Kode Kelas Disini',
                type: 'text'
            },
            {
                id: 'kode_kelas_bpjs',
                placeholder: 'Cari Kode Kelas BPJS Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'kelas',
        searchPlaceholder: 'Cari Nama Kelas Disini',
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
            id: 'form_setup_kelas',
            fields: [
                {
                    id: 'id_kelas',
                    label: 'Kode Kelas',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'nama_kelas',
                    label: 'Nama Kelas',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'kode_kelas',
                    label: 'Kode Kelas',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'kode_kelas_bpjs',
                    label: 'Kode Kelas BPJS',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_kelas_satu_sehat',
                    label: 'Kelas Satu Sehat',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: false,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-1',
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
            .select(SetupKelasState.kelasState)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
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
        this.ButtonNavigation = [];
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            this.FormComps.FormGroup.patchValue(args);
        }, 500);
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
                    this.updateStatusKelas(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this._store.dispatch(new SetupKelasActions.GetAllKelas({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this._store.dispatch(new SetupKelasActions.GetAllKelas({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    saveKelas(data: any) {
        this._store
            .dispatch(new SetupKelasActions.CreateKelas(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kelas.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateKelas(data: any) {
        this._store
            .dispatch(new SetupKelasActions.UpdateKelas(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kelas.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusKelas(data: any) {
        this._store
            .dispatch(new SetupKelasActions.UpdateStatusKelas(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kelas.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

}
