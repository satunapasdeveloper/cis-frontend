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
import { SetupKamarState, SetupKamarActions } from 'src/app/store/setup-data/kamar';
import { SetupKategoriKamarActions, SetupKategoriKamarState } from 'src/app/store/setup-data/kategori-kamar';
import { SetupKelasActions, SetupKelasState } from 'src/app/store/setup-data/kelas';
import { SetupPoliActions, SetupPoliState } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-setup-kamar',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-kamar.component.html',
    styleUrl: './setup-kamar.component.scss'
})
export class SetupKamarComponent implements OnInit, OnDestroy {

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
        id: 'SetupKamar',
        column: [
            { field: 'nama_kategori', headerName: 'Kategori', },
            { field: 'no_kamar', headerName: 'No. Kamar', class: 'text-blue-500 font-semibold' },
            { field: 'label_kamar', headerName: 'Label Kamar' },
            { field: 'no_lantai', headerName: 'No. Lantai' },
            { field: 'nama_poli', headerName: 'Poli' },
            { field: 'nama_kelas', headerName: 'Kelas' },
            { field: 'gender', headerName: 'Gender' },
            { field: 'is_isolasi', headerName: 'Isolasi', renderAsCheckbox: true, class: 'text-center' },
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
                id: 'no_kamar',
                placeholder: 'Cari No. Kamar Disini',
                type: 'text'
            },
            {
                id: 'label_kamar',
                placeholder: 'Cari Label Kamar Disini',
                type: 'text'
            },
            {
                id: 'no_lantai',
                placeholder: 'Cari No. Lantai Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Kamar Disini'
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
            id: 'form_setup_kamar',
            fields: [
                {
                    id: 'id_bed_kamar',
                    label: 'Kode Kamar',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_bed_kategori',
                    label: 'Kategori',
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
                    id: 'no_kamar',
                    label: 'No. Kamar',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'label_kamar',
                    label: 'Label Kamar',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'no_lantai',
                    label: 'No. Lantai',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_poli',
                    label: 'Poli',
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
                    id: 'id_kelas',
                    label: 'Kelas',
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
                    id: 'gender',
                    label: 'Gender',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'Laki - Laki', value: 'L' },
                            { name: 'Perempuan', value: 'P' },
                        ],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'keterangan',
                    label: 'Keterangan',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'is_isolasi',
                    label: 'Isolasi',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'is_isolasi',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'is_isolasi',
                            label: 'Iya',
                            value: true,
                        }
                    ],
                    value: false,
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllKategori();
        this.getAllPoli();
        this.getAllKelas();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupKamarState.kamarState)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.entities;
                    this.GridProps.totalRows = result.totalRows;
                }
            });
    }

    private getAllKategori() {
        this._store
            .dispatch(new SetupKategoriKamarActions.GetAllActiveKategoriKamar({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_bed_kategori');
                    this.FormProps.fields[index].dropdownProps.options = result.setup_kategori_kamar.actives.map((item: any) => {
                        return {
                            name: item.nama_kategori,
                            value: item.id_bed_kategori
                        }
                    })
                }
            });
    }

    private getAllPoli() {
        this._store
            .dispatch(new SetupPoliActions.GetAllActivePoli({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_poli');
                    this.FormProps.fields[index].dropdownProps.options = result.setup_poli.actives.map((item: any) => {
                        return {
                            name: item.nama_poli,
                            value: item.id_poli
                        }
                    })
                }
            });
    }

    private getAllKelas() {
        this._store
            .dispatch(new SetupKelasActions.GetAllActiveKelas({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_kelas');
                    this.FormProps.fields[index].dropdownProps.options = result.setup_kelas.actives.map((item: any) => {
                        return {
                            name: item.nama_kelas,
                            value: item.id_kelas
                        }
                    })
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
                    this.updateStatusKamar(args.data);
                }
            });
        }


        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this._store.dispatch(new SetupKamarActions.GetAllKamar({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this._store.dispatch(new SetupKamarActions.GetAllKamar({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    saveKamar(data: any) {
        this._store
            .dispatch(new SetupKamarActions.CreateKamar(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kamar.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateKamar(data: any) {
        this._store
            .dispatch(new SetupKamarActions.UpdateKamar(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kamar.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusKamar(data: any) {
        this._store
            .dispatch(new SetupKamarActions.UpdateStatusKamar(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kamar.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

}
