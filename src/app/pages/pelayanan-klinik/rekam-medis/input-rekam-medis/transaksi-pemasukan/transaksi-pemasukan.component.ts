import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { map, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { TransaksiPemasukanService } from 'src/app/services/pelayanan-klinik/rekam-medis/transaksi-pemasukan.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SetupTarifService } from 'src/app/services/billing/setup-data/setup-tarif.service';
import { SetupTarifModel } from 'src/app/model/pages/billing/setup-data/setup-tarif.model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Store } from '@ngxs/store';
import { SetupNakesState, SetupNakesActions } from 'src/app/store/setup-data/nakes';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';

@Component({
    selector: 'app-transaksi-pemasukan',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        GridComponent,
        DashboardComponent,
        InputTextareaModule,
        ConfirmDialogModule,
        DynamicFormComponent,
        InformasiPasienComponent,
    ],
    templateUrl: './transaksi-pemasukan.component.html',
    styleUrl: './transaksi-pemasukan.component.scss'
})
export class TransaksiPemasukanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        },
        {
            id: 'add',
            title: 'Tambah',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'TransaksiPemasukanGrid',
        column: [
            { field: 'tanggal_transaksi', headerName: 'Tgl. Transaksi', class: 'text-blue-500 font-semibold', format: 'datetime' },
            { field: 'nama_tarif', headerName: 'Nama Tarif' },
            { field: 'qty', headerName: 'Qty', format: 'number', class: 'text-end' },
            { field: 'harga', headerName: 'Nominal Tarif', format: 'number', class: 'text-end' },
            { field: 'subtotal', headerName: 'Subtotal', format: 'number', class: 'text-end' },
            { field: 'nama_dokter', headerName: 'Dokter', },
            { field: 'nama_poli', headerName: 'Poliklinik', },
            { field: 'status', headerName: 'Status', class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Cancel', 'Detail'],
        showPaging: false,
        showSearch: false,
        isCustomSearch: false,
        customSearchProps: [
            {
                id: 'no_bed',
                placeholder: 'Cari No. Bed Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'nomor_bed',
        searchPlaceholder: 'Cari No. Bed Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    ShowDialogForm = false;
    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    ShowDialogBatal = false;
    ReasonCanceled = "";

    constructor(
        private _store: Store,
        private _router: Router,
        private _utilityService: UtilityService,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _setupTarifService: SetupTarifService,
        private _confirmationService: ConfirmationService,
        private _transaksiPemasukanService: TransaksiPemasukanService,
    ) {
        this.FormProps = {
            id: 'form_detail_tindakan_medis',
            fields: [
                {
                    id: 'id_register',
                    label: 'ID Register',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_transaksi',
                    label: 'ID Transaksi',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_poli',
                    label: 'ID Poli',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_tarif_berlaku',
                    label: 'ID Tarif Berlaku',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'tanggal_transaksi',
                    label: 'Tgl. Transaksi',
                    required: true,
                    type: 'datetime',
                    value: '',
                },
                {
                    id: 'id_tarif',
                    label: 'Pilih Tarif Tindakan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_tarif',
                        optionValue: 'id_tarif',
                        customField: {
                            title: 'nama_tarif',
                            subtitle: 'nominal_tarif_currency',
                            description: 'jenis_tarif'
                        }
                    },
                    onChange: (args: any) => {
                        this.FormComps.FormGroup.get('harga')?.setValue(args ? args.nominal_tarif : 0);
                        this.FormComps.FormGroup.get('qty')?.setValue(1);
                        this.FormComps.FormGroup.get('diskon_dokter')?.setValue(0);
                        this.FormComps.FormGroup.get('id_tarif_berlaku')?.setValue(args ? args.id_tarif_berlaku : 0);
                        this.onCountSubtotalForm();
                    }
                },
                {
                    id: 'id_dokter',
                    label: 'Dokter Periksa',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                    },
                },
                {
                    id: 'id_perawat',
                    label: 'Perawat / Petugas Medis',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                    },
                },
                {
                    id: 'harga',
                    label: 'Nominal Tarif',
                    required: true,
                    type: 'number',
                    value: 0,
                    readonly: true,
                    onChange: (args) => this.onCountSubtotalForm()
                },
                {
                    id: 'qty',
                    label: 'Qty',
                    required: true,
                    type: 'number',
                    value: 0,
                    onChange: (args) => this.onCountSubtotalForm()
                },
                {
                    id: 'total',
                    label: 'Total',
                    required: true,
                    type: 'number',
                    value: 0,
                    readonly: true,
                },
                {
                    id: 'diskon_dokter',
                    label: 'Diskon Dokter',
                    required: true,
                    type: 'number',
                    value: 0,
                    onChange: (args) => this.onCountSubtotalForm()
                },
                {
                    id: 'subtotal',
                    label: 'Sub Total',
                    required: true,
                    type: 'number',
                    value: 0,
                    readonly: true,
                },
            ],
            style: 'inline',
            class: 'grid-rows-9 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllTarif();
        this.getAllNakes();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this._router.navigateByUrl("/pelayanan-klinik/rawat-jalan/antrian-poliklinik");
        };

        if (data.id == 'add') {
            this.FormState = 'insert';
            this.ShowDialogForm = true;
            this.FormComps.FormGroup.reset();
            this.FormComps.FormGroup.get('id_register')?.setValue(this._activatedRoute.snapshot.queryParams['id_register']);
            this.FormComps.FormGroup.get('id_poli')?.setValue(this._activatedRoute.snapshot.queryParams['id_poli']);
        };
    }

    private getAll() {
        const id_register = this._activatedRoute.snapshot.queryParams['id_register'];

        this._transaksiPemasukanService
            .getAll(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("data =>", result.data);
                    this.GridProps.dataSource = result.data;
                }
            });
    }

    private getAllTarif() {
        const query: SetupTarifModel.GetForTindakanMedisQueryParams = {
            jenis_rawat: this._activatedRoute.snapshot.queryParams['jenis_rawat'],
            id_poli: this._activatedRoute.snapshot.queryParams['id_poli'],
            id_kelas: this._activatedRoute.snapshot.queryParams['id_kelas'],
        };

        this._setupTarifService
            .getAllForTindakanMedis(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    const data = result.data.map((item: any) => {
                        return {
                            ...item,
                            nominal_tarif_currency: formatCurrency(item.nominal_tarif, 'EN', 'Rp. '),
                            jenis_tarif: `Jenis : ${item.jenis_tarif}`
                        }
                    });

                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_tarif');
                    if (index > -1) {
                        this.FormProps.fields[index].dropdownProps.options = data;
                    }
                }
            })
    }

    private getAllNakes() {
        this._store
            .select(SetupNakesState.nakesActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupNakesActions.GetAllActiveNakes({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupNakesState.nakesActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options: any) => {
                const indexDokter = this.FormProps.fields.findIndex(item => item.id == 'id_dokter');
                if (indexDokter > -1) {
                    this.FormProps.fields[indexDokter].dropdownProps.options = options;
                }

                const indexPerawat = this.FormProps.fields.findIndex(item => item.id == 'id_perawat');
                if (indexPerawat > -1) {
                    this.FormProps.fields[indexPerawat].dropdownProps.options = options;
                }
            });
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        setTimeout(() => {
            let data = JSON.parse(JSON.stringify(args));
            data.tanggal_transaksi = data.tanggal_transaksi ? new Date(data.tanggal_transaksi) : null;
            data.total = args.harga * args.qty;
            this.FormComps.FormGroup.patchValue(data);
            this.FormState = 'update';
            this.ShowDialogForm = true;
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'cancel') {
            this.ReasonCanceled = "";
            this.ShowDialogBatal = true;
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    private onCountSubtotalForm() {
        const harga = this.FormComps.FormGroup.get('harga')?.value ? this.FormComps.FormGroup.get('harga')?.value : 0,
            qty = this.FormComps.FormGroup.get('qty')?.value ? this.FormComps.FormGroup.get('qty')?.value : 0,
            diskon_dokter = this.FormComps.FormGroup.get('diskon_dokter')?.value ? this.FormComps.FormGroup.get('diskon_dokter')?.value : 0;

        this.FormComps.FormGroup.get('total')?.setValue(harga * qty);
        this.FormComps.FormGroup.get('subtotal')?.setValue((harga * qty) - diskon_dokter);
    }

    handleSaveDetailTransaksi(args: any) {
        this._transaksiPemasukanService
            .create(args)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan' });
                    this.ShowDialogForm = false;
                    this.getAll();
                }
            })
    }

    handleUpdateDetailTransaksi(args: any) {
        this._transaksiPemasukanService
            .update(args)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil diperbarui' });
                    this.ShowDialogForm = false;
                    this.getAll();
                }
            })
    }

    handleBatalDetailTransaksi(reason_canceled: string) {
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
                    id_transaksi: this.GridSelectedData.id_transaksi,
                    reason_canceled
                };

                this._transaksiPemasukanService
                    .cancel(payload)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.responseResult) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil dibatalkan' });
                            this.ShowDialogBatal = false;
                            this.getAll();
                        }
                    })
            }
        });
    }
}
