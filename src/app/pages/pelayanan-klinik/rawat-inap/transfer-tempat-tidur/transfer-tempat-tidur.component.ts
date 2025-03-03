import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranRawatInapService } from 'src/app/services/pelayanan-klinik/rawat-inap/pendaftaran-rawat-inap.service';
import { TransferTempatTidurService } from 'src/app/services/pelayanan-klinik/rawat-inap/transfer-tempat-tidur.service';
import { BedService } from 'src/app/services/pelayanan-klinik/setup-data/bed.service';
import { KamarService } from 'src/app/services/pelayanan-klinik/setup-data/kamar.service';

@Component({
    selector: 'app-transfer-tempat-tidur',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        InformasiPasienComponent,
        TooltipModule,
        DialogModule,
        CalendarModule,
        InputTextareaModule,
    ],
    templateUrl: './transfer-tempat-tidur.component.html',
    styleUrl: './transfer-tempat-tidur.component.scss'
})
export class TransferTempatTidurComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'PermintaanOperasi',
        column: [
            { field: 'no_bed_transfer', headerName: 'No. Transfer', class: 'text-blue-500 font-semibold' },
            { field: 'tanggal_bed_request', headerName: 'Tgl. Transfer', format: 'datetime' },
            { field: 'bed_kamar_asal.label_kamar', headerName: 'Kamar Asal' },
            { field: 'bed_asal.no_bed', headerName: 'Bed Asal' },
            { field: 'bed_kamar_tujuan.label_kamar', headerName: 'Kamar Asal' },
            { field: 'bed_tujuan.no_bed', headerName: 'Bed Asal' },
            { field: 'keterangan_request', headerName: 'Keterangan', },
            { field: 'keterangan_approve', headerName: 'Keterangan Approve', },
            { field: 'approved_at', headerName: 'Tgl. Approve', format: 'datetime' },
            { field: 'canceled_at', headerName: 'Tgl. Cancel', format: 'datetime' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Approve', 'Cancel'],
        showPaging: false,
        showSearch: false,
        isCustomSearch: false,
        customSearchProps: [
            {
                id: 'id_register',
                placeholder: 'Cari Register Pasien Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionName: 'nama_pasien',
                    optionValue: 'id_register'
                }
            },
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. AsalRujukan Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    ToggleCard = true;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    ShowDialogAction = false;
    Action: 'approve' | 'cancel' = 'approve';
    IdBedTransfer = 0;
    Keterangan = "";
    Tanggal = new Date();

    constructor(
        private _bedService: BedService,
        private _lamarService: KamarService,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _transferTempatTidurService: TransferTempatTidurService,
        private _pendaftaranRawatInapService: PendaftaranRawatInapService
    ) {
        this.FormProps = {
            id: 'form_transfer_tempat_tidur',
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
                    type: 'datetime',
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
                        optionName: 'label_kamar',
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
                        optionName: 'no_bed',
                        optionValue: 'id_bed',
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
                        optionName: 'label_kamar',
                        optionValue: 'id_bed_kamar',
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this._bedService
                                .getAllActive({ page: 1, count: 100, id_bed_kamar: args.id_bed_kamar })
                                .pipe(takeUntil(this.Destroy$))
                                .subscribe((result) => {
                                    if (result) {
                                        const index = this.FormProps.fields.findIndex(item => item.id == 'id_bed_tujuan');
                                        this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                                    }
                                });
                        }
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
                        optionName: 'no_bed',
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
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAllKamar();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const state = this._activatedRoute.snapshot.queryParams['state'];

            if (state == 'create') {
                this.PageState = 'form';

                setTimeout(() => {
                    const pasien = JSON.parse(localStorage.getItem("_SPSH_") as any);
                    this.FormComps.FormGroup.get('id_register')?.setValue(pasien.id_register);

                    this.getAll({ id_register: pasien.id_register });
                }, 500);
            }
        }, 1);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        if (!query) {
            this._messageService.clear();
            this._messageService.add({ severity: 'warning', summary: 'Oops', detail: 'Register Pasien Tidak Boleh Kosong' })
        } else {
            this._transferTempatTidurService
                .getAll(query)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data;
                        this.GridProps.totalRows = result.data.totalRows;
                    }
                });
        }


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
            this.Action = 'approve';
            this.IdBedTransfer = args.data.id_bed_transfer;
            this.ShowDialogAction = true;
        }

        if (args.type == 'cancel') {
            this.Action = 'cancel';
            this.IdBedTransfer = args.data.id_bed_transfer;
            this.ShowDialogAction = true;
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

    handleSaveAction(action: 'approve' | 'cancel') {
        if (action == 'approve') {
            const payload = {
                id_bed_transfer: this.IdBedTransfer,
                keterangan_approve: this.Keterangan,
                tanggal_bed_approve: this.Tanggal
            };

            this._transferTempatTidurService
                .approve(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Transfer Tempat Tidur Berhasil Di Approve' });
                        this.ShowDialogAction = false;
                        const pasien = JSON.parse(localStorage.getItem("_SPSH_") as any);
                        this.getAll({ id_register: pasien.id_register })
                    }
                });
        };

        if (action == 'cancel') {
            const payload = {
                id_bed_transfer: this.IdBedTransfer,
                reason_canceled: this.Keterangan,
            };

            this._transferTempatTidurService
                .cancel(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Transfer Tempat Tidur Berhasil Di Batalkan' });
                        this.ShowDialogAction = false;
                        const pasien = JSON.parse(localStorage.getItem("_SPSH_") as any);
                        this.getAll({ id_register: pasien.id_register })
                    }
                });
        }
    }
}
