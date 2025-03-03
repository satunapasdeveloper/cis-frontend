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
import { TransferTempatTidurService } from 'src/app/services/pelayanan-klinik/rawat-inap/transfer-tempat-tidur.service';
import { BedService } from 'src/app/services/pelayanan-klinik/setup-data/bed.service';
import { KamarService } from 'src/app/services/pelayanan-klinik/setup-data/kamar.service';

@Component({
    selector: 'app-transfer-tempat-tidur',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './transfer-tempat-tidur.component.html',
    styleUrl: './transfer-tempat-tidur.component.scss'
})
export class TransferTempatTidurComponent implements OnInit, OnDestroy {

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
        toolbar: ['Approve', 'Cancel'],
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
        private _bedService: BedService,
        private _lamarService: KamarService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _transferTempatTidurService: TransferTempatTidurService,
    ) {
        this.FormProps = {
            id: 'form_setup_asal_rujukan',
            fields: [
                {
                    id: 'id_bed_transfer',
                    label: 'ID Bed Transfer',
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
                    id: 'tanggal_bed_request',
                    label: 'Tgl. Bed Transfer',
                    required: true,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'id_bed_kamar_asal',
                    label: 'Kamar Asal',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_bed_kamar',
                        optionValue: 'id_bed_kamar',
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this._bedService
                                .getAllActive({ page: 1, count: 100, id_bed_kamar: args.id_bed_kamar })
                                .pipe(takeUntil(this.Destroy$))
                                .subscribe((result) => {
                                    if (result) {
                                        const index = this.FormProps.fields.findIndex(item => item.id == 'id_bed_asal');
                                        this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                                    }
                                });
                        }
                    }
                },
                {
                    id: 'id_bed_asal',
                    label: 'Bed Asal',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_bed',
                        optionValue: 'id_bed',
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this._bedService
                                .getAllActive({ page: 1, count: 100, id_bed_kamar: args.id_bed_kamar })
                                .pipe(takeUntil(this.Destroy$))
                                .subscribe((result) => {
                                    if (result) {
                                        const index = this.FormProps.fields.findIndex(item => item.id == 'id_bed_kamar_tujuan');
                                        this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                                    }
                                });
                        }
                    }
                },
                {
                    id: 'id_bed_kamar_tujuan',
                    label: 'Kamar Tujuan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_bed_kamar',
                        optionValue: 'id_bed_kamar',
                    }
                },
                {
                    id: 'id_bed_tujuan',
                    label: 'Bed Tujuan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_bed',
                        optionValue: 'id_bed',
                    }
                },
                {
                    id: 'keterangan_request',
                    label: 'Keterangan',
                    required: false,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-6 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAllKamar();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(id_register: any) {
        this._transferTempatTidurService
            .getAll(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                }
            });
    }

    private getAllKamar() {
        this._lamarService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const indexAsal = this.FormProps.fields.findIndex(item => item.id == 'id_bed_kamar_asal');
                    this.FormProps.fields[indexAsal].dropdownProps.options = result.data.rows;

                    const indexTujuan = this.FormProps.fields.findIndex(item => item.id == 'id_bed_kamar_tujuan');
                    this.FormProps.fields[indexTujuan].dropdownProps.options = result.data.rows;
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
        if (args.type == 'approve') {
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

        if (args.type == 'cancel') {
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

        this._transferTempatTidurService
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

        this._transferTempatTidurService
            .approve(data)
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
