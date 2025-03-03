import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { PermintaanOperasiService } from 'src/app/services/pelayanan-klinik/rawat-inap/permintaan-operasi.service';
import { SetupGedungOperasiService } from 'src/app/services/pelayanan-klinik/setup-data/setup-gedung-operasi.service';
import { SetupKamarOperasiService } from 'src/app/services/pelayanan-klinik/setup-data/setup-kamar-operasi.service';
import { SetupRencanaAnestesiService } from 'src/app/services/pelayanan-klinik/setup-data/setup-rencana-anestesi.service';

@Component({
    selector: 'app-permintaan-operasi',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './permintaan-operasi.component.html',
    styleUrl: './permintaan-operasi.component.scss'
})
export class PermintaanOperasiComponent implements OnInit, OnDestroy {

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
        id: 'PermintaanOperasi',
        column: [
            { field: 'register.no_register', headerName: 'No. Register', class: 'text-blue-500 font-semibold' },
            { field: 'register.pasien.nama_pasien', headerName: 'Nama Pasien' },
            { field: 'tanggal_permintaan', headerName: 'Tgl. Permintaan', format: 'datetime' },
            { field: 'ruang_operasi.nama_ruang_operasi', headerName: 'Ruang Operasi' },
            { field: 'rencana_anestesi.nama_anestesi', headerName: 'Rencana Anastesi' },
            { field: 'status', headerName: 'Status', class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Status', 'Detail'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'tanggal_permintaan',
                placeholder: 'Cari Tgl. Permintaan Disini',
                type: 'date'
            },
            {
                id: 'no_register',
                placeholder: 'Cari No. Register Disini',
                type: 'text'
            },
            {
                id: 'nama_ruang_operasi',
                placeholder: 'Cari Ruang Operasi Disini',
                type: 'text'
            },
            {
                id: 'nama_anestesi',
                placeholder: 'Cari Rencana Anastesi Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. AsalRujukan Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _setupRuangOperasiService: SetupKamarOperasiService,
        private _permintaanOperasiService: PermintaanOperasiService,
        private _setupGedungOperasiService: SetupGedungOperasiService,
        private _setupRencanaAnastesiService: SetupRencanaAnestesiService,
    ) {
        this.FormProps = {
            id: 'form_setup_asal_rujukan',
            fields: [
                {
                    id: 'id_permintaan_operasi',
                    label: 'ID Permintaan Operais',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_register',
                    label: 'ID Register',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'tanggal_permintaan',
                    label: 'Tgl. Permintaan Operasi',
                    required: true,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'id_rencana_anestesi',
                    label: 'Rencana Anestesi',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_anestesi',
                        optionValue: 'id_rencana_anestesi',
                    }
                },
                {
                    id: 'id_gedung_operasi',
                    label: 'Gedung Operasi',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_gedung_operasi',
                        optionValue: 'id_gedung_operasi',
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this.getAllKamarOperasi(args.kode_gedung_operasi);
                        }
                    }
                },
                {
                    id: 'id_ruang_operasi',
                    label: 'Ruang Operasi',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_ruang_operasi',
                        optionValue: 'id_ruang_operasi',
                    }
                },
                {
                    id: 'estimasi_waktu_menit',
                    label: 'Estimasi Waktu (Menit)',
                    required: true,
                    type: 'number',
                    value: '',
                },
                {
                    id: 'is_ranap_pasca_operasi',
                    label: 'Rawat Inap Pasca Operasi',
                    required: true,
                    type: 'radio',
                    value: '',
                    radioButtonProps: [
                        { name: 'is_ranap_pasca_operasi', label: 'Iya', value: true },
                        { name: 'is_ranap_pasca_operasi', label: 'Tidak', value: false },
                    ]
                },
                {
                    id: 'is_laboratorium',
                    label: 'Order Laboratorium',
                    required: true,
                    type: 'radio',
                    value: '',
                    radioButtonProps: [
                        { name: 'is_laboratorium', label: 'Iya', value: true },
                        { name: 'is_laboratorium', label: 'Tidak', value: false },
                    ]
                },
                {
                    id: 'is_radiologi',
                    label: 'Order Radiologi',
                    required: true,
                    type: 'radio',
                    value: '',
                    radioButtonProps: [
                        { name: 'is_radiologi', label: 'Iya', value: true },
                        { name: 'is_radiologi', label: 'Tidak', value: false },
                    ]
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-8 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll({ page: 1, count: 5 });
        this.getAllRencanaAnastesi();
        this.getAllGedungOperasi();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        this._permintaanOperasiService
            .getAllActive(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                }
            });
    }

    private getAllRencanaAnastesi() {
        this._setupRencanaAnastesiService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_rencana_anestesi');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                }
            });
    }

    private getAllGedungOperasi() {
        this._setupGedungOperasiService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_gedung_operasi');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                }
            });
    }

    private getAllKamarOperasi(kode_gedung_operasi: string) {
        this._setupRuangOperasiService
            .getAllActive({ page: 1, count: 100, kode_gedung_operasi: kode_gedung_operasi })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_ruang_operasi');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
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

        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
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
            // this._confirmationService.confirm({
            //     target: (<any>event).target as EventTarget,
            //     message: 'Data akan diubah statusnya',
            //     header: 'Apakah Anda Yakin?',
            //     icon: 'pi pi-info-circle',
            //     acceptButtonStyleClass: "p-button-danger p-button-sm",
            //     rejectButtonStyleClass: "p-button-secondary p-button-sm",
            //     acceptIcon: "none",
            //     acceptLabel: 'Iya Saya Yakin',
            //     rejectIcon: "none",
            //     rejectLabel: 'Tidak, Kembali',
            //     accept: () => {
            //         this.updateStatusAsalRujukan(args.data);
            //     }
            // });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    saveAsalRujukan(data: any) {
        delete data.id_permintaan_operasi;
        delete data.id_gedung_operasi;

        this._permintaanOperasiService
            .create(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateAsalRujukan(data: any) {
        delete data.id_gedung_operasi;

        this._permintaanOperasiService
            .update(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }
}
