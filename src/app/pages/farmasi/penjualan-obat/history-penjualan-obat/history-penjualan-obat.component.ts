import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, BehaviorSubject, takeUntil, map } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PenjualanObatService } from 'src/app/services/farmasi/penjualan-obat/penjualan-obat.service';
import { SetupGolonganService } from 'src/app/services/farmasi/setup-data/setup-golongan.service';
import { SetupGolonganState, SetupGolonganActions } from 'src/app/store/farmasi/setup-data/setup-golongan';

@Component({
    selector: 'app-history-penjualan-obat',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        PaginatorModule,
        InputTextareaModule,
        InputNumberModule,
        DialogModule,
    ],
    templateUrl: './history-penjualan-obat.component.html',
    styleUrl: './history-penjualan-obat.component.scss'
})
export class HistoryPenjualanObatComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'HistoryPenjualanObat',
        column: [
            { field: 'no_penjualan', headerName: 'No. Penjualan', class: 'font-semibold text-blue-500' },
            { field: 'tanggal_penjualan', headerName: 'Tgl. Penjualan', format: 'datetime' },
            { field: 'no_antrian_farmasi', headerName: 'No. Antrian', },
            { field: 'no_register', headerName: 'No. Register', },
            { field: 'no_rekam_medis', headerName: 'No. RM', },
            { field: 'nama_pasien', headerName: 'Nama Pasien', },
            { field: 'nama_dokter', headerName: 'Nama Dokter', },
            { field: 'status_delivery', headerName: 'Status Pengiriman', class: 'text-center' },
            { field: 'status_penjualan', headerName: 'Status Transaksi', class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'nama_golongan',
        searchPlaceholder: 'Cari Nama Golongan Disini',
        totalRows: 0,
    };
    GridSelectedData: any;
    GridCurrentPage: number = 0;
    GridCurrentCount: number = 0;

    First: number = 0;

    Rows: number = 10;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    GridDetailProps: GridModel.IGrid = {
        id: 'DetailPenjualanObat',
        column: [
            { field: 'nama_obat', headerName: 'Nama Obat', class: 'font-semibold text-blue-500' },
            { field: 'aturan_pakai', headerName: 'Aturan Pakai' },
            { field: 'rute_pemberian_obat', headerName: 'Rute Pemberian' },
            { field: 'sediaan', headerName: 'Sediaan' },
            { field: 'qty', headerName: 'Qty', format: 'number', class: 'text-end' },
            { field: 'satuan', headerName: 'Satuan', },
            { field: 'harga', headerName: 'Harga', format: 'number', class: 'text-end' },
            { field: 'subtotal', headerName: 'Subtotal', format: 'number', class: 'text-end' },
            { field: 'is_racikan', headerName: 'Obat Racikan', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        showPaging: false,
        showSearch: false,
        showSort: false,
        searchKeyword: 'nama_golongan',
        searchPlaceholder: 'Cari Nama Golongan Disini',
        totalRows: 0,
    };

    ShowModalPengiriman: boolean = false;
    AlamatPengiriman: string = "";
    OngkosKirim = 0;

    ShowDialogBatal = false;
    ReasonCanceled = "";

    constructor(
        private _store: Store,
        private _messageService: MessageService,
        private _golonganService: SetupGolonganService,
        private _confirmationService: ConfirmationService,
        private _penjualanObatService: PenjualanObatService,
    ) {
        this.FormProps = {
            id: 'FormHistoryPenjualanObat',
            fields: [
                {
                    id: 'id_penjualan_obat',
                    label: 'Tgl. Penjualan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'tanggal_penjualan',
                    label: 'Tgl. Penjualan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_penjualan',
                    label: 'No. Penjualan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_antrian_farmasi',
                    label: 'No. Antrian',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_register',
                    label: 'No. Register',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_pasien',
                    label: 'Nama Pasien',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_rekam_medis',
                    label: 'No. Rekam Medis',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_dokter',
                    label: 'Nama Dokter',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_stokroom',
                    label: 'Stokroom',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'status_farmasi',
                    label: 'Status Penjualan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll(1, 5);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(page: number, count: number) {
        this._penjualanObatService
            .getAll({ page: page, count: count, jenis_trans: 'OBAT' })
            .pipe(
                takeUntil(this.Destroy$),
                map((result: any) => {
                    if (result.responseResult) {
                        result.data.rows = result.data.rows.map((item: any) => ({
                            id_penjualan_obat: item.id_penjualan_obat,
                            tanggal_penjualan: item.tanggal_penjualan,
                            no_penjualan: item.no_penjualan,
                            id_register: item.id_register,
                            id_dokter: item.id_dokter,
                            id_stokroom: item.id_stokroom,
                            jenis_trans: item.jenis_trans,
                            status_penjualan: item.status_penjualan,
                            status_billing: item.status_billing,
                            status_delivery: item.status_delivery,
                            alamat_delivery: item.alamat_delivery,
                            is_delivery: item.is_delivery,
                            jumlah_item: item.jumlah_item,
                            biaya_kirim: item.biaya_kirim,
                            total_harga: item.total_harga,
                            created_at: item.created_at,
                            created_by: item.created_by,
                            updated_at: item.updated_at,
                            updated_by: item.updated_by,
                            canceled_at: item.canceled_at,
                            canceled_by: item.canceled_by,
                            reason_canceled: item.reason_canceled,
                            validated_at: item.validated_at,
                            validated_by: item.validated_by,
                            no_register: item.register?.no_register || null,
                            no_antrian_farmasi: item.register?.no_antrian_farmasi || null,
                            status_farmasi: item.register?.status_farmasi || null,
                            nama_pasien: item.register?.pasien?.nama_pasien || null,
                            no_rekam_medis: item.register?.pasien?.no_rekam_medis || null,
                            nik_pasien: item.register?.pasien?.nik || null,
                            nama_penjamin: item.register?.penjamin?.nama_penjamin || null,
                            nama_dokter: item.dokter?.nama || null,
                            nik_dokter: item.dokter?.nik || null,
                            kode_stokroom: item.stokroom?.kode_stokroom || null,
                            nama_stokroom: item.stokroom?.nama_stokroom || null,
                            detail_resep: [] // Placeholder untuk detail_resep
                        }));

                        return result;
                    }
                })
            )
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                    this.GridCurrentPage = page;
                    this.GridCurrentCount = count;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this.AlamatPengiriman = "";
            this.OngkosKirim = 0;
            this.FormComps.FormGroup.reset();
            this.PageState = 'list';
            this.getAll(this.GridCurrentPage, this.GridCurrentCount);
            this.ButtonNavigation = [];
        };

        if (data.id == 'pengiriman') {
            this.ShowModalPengiriman = true;
        };

        if (data.id == 'change_status_terkirim') {
            this.updateStatusMejadiTerkirim();
        };

        if (data.id == 'cancel') {
            this.ReasonCanceled = "";
            this.ShowDialogBatal = true;
        }
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
        this.ButtonNavigation = [
            {
                id: 'back',
                title: 'Kembali',
                icon: 'pi pi-chevron-left'
            },
            {
                id: 'cancel',
                title: 'Batalkan Penjualan',
                icon: 'pi pi-trash'
            },
            {
                id: 'pengiriman',
                title: 'Pengiriman',
                icon: 'pi pi-truck'
            },
            {
                id: 'change_status_terkirim',
                title: 'Ubah Status Menjadi Terkirim',
                icon: 'pi pi-send'
            },
        ];

        // ** Set value ke Dynamic form components
        this._penjualanObatService
            .getById(args.id_penjualan_obat)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormComps.FormGroup.patchValue(args);
                    this.GridDetailProps.dataSource = result.data.detail_obat;
                    this.AlamatPengiriman = result.data.alamat_delivery;
                    this.OngkosKirim = result.data.biaya_kirim;
                }
            })
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        };
    }

    onPageChanged(args: any): void {
        this.getAll(args.page + 1, args.rows);
    }

    updatePengiriman() {
        const payload = {
            id_penjualan_obat: this.FormComps.FormGroup.get('id_penjualan_obat')?.value,
            is_delivery: true,
            alamat_delivery: this.AlamatPengiriman,
            biaya_kirim: this.OngkosKirim
        }

        this._penjualanObatService
            .deliver(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Pengiriman Berhasil Diperbarui' });
                    this.ShowModalPengiriman = false;
                    this.onRowDoubleClicked({ id_penjualan_obat: payload.id_penjualan_obat })
                }
            })
    }

    updateStatusMejadiTerkirim() {
        this._penjualanObatService
            .changeStatusToDelivered(this.FormComps.FormGroup.get('id_penjualan_obat')?.value)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Transaksi Berhasil Diperbarui' });
                    this.handleClickButtonNavigation({
                        id: 'back',
                        title: 'Kembali',
                        icon: 'pi pi-chevron-left'
                    })
                }
            })
    }

    handleCancelOrder(reason_canceled: string) {
        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            message: 'Data akan dibatalkan',
            header: 'Apakah Anda Yakin?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Iya Saya Yakin',
            rejectIcon: "none",
            rejectLabel: 'Tidak, Kembali',
            accept: () => {
                const payload = {
                    id_penjualan_obat: this.FormComps.FormGroup.get('id_penjualan_obat')?.value,
                    reason_canceled
                };

                this._penjualanObatService
                    .cancel(payload.id_penjualan_obat, payload.reason_canceled)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.responseResult) {
                            this._confirmationService.close();
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil dibatalkan' });
                            this.ShowDialogBatal = false;
                            this.handleClickButtonNavigation({
                                id: 'back',
                                title: 'Kembali',
                                icon: 'pi pi-chevron-left'
                            })
                        }
                    })
            }
        });
    }
}   
