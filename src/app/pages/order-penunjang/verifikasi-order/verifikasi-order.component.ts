import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { LaboratoriumService } from 'src/app/services/pelayanan-klinik/rekam-medis/laboratorium.service';
import { RadiologiService } from 'src/app/services/pelayanan-klinik/rekam-medis/radiologi.service';
import { SetupNakesState, SetupNakesActions } from 'src/app/store/setup-data/nakes';

@Component({
    selector: 'app-verifikasi-order',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        DialogModule,
        GridComponent,
        DropdownModule,
        DashboardComponent,
        ConfirmDialogModule,
        InputTextareaModule,
        DynamicFormComponent,
        InformasiPasienComponent,
    ],
    templateUrl: './verifikasi-order.component.html',
    styleUrl: './verifikasi-order.component.scss'
})
export class VerifikasiOrderComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    IsLaboratorium: boolean = true;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'SetupGroupItem',
        column: [
            { field: 'nomor_order_penunjang', headerName: 'No. Order', class: 'text-blue-500 font-semibold' },
            { field: 'tanggal_order_penunjang', headerName: 'Tgl. Order', format: 'date' },
            { field: 'no_register', headerName: 'No. Register' },
            { field: 'no_rekam_medis', headerName: 'No. Rekam Medis' },
            { field: 'nama_pasien', headerName: 'Nama Pasien' },
            { field: 'status_tes', headerName: 'Status Penjadwalan', },
            { field: 'tanggal_tes', headerName: 'Tgl. Pemeriksaan', format: 'datetime' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Verifikasi'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'nomor_order_penunjang',
                placeholder: 'Cari No. Order Disini',
                type: 'text'
            },
            {
                id: 'tanggal_order_penunjang',
                placeholder: 'Cari Tgl. Order Disini',
                type: 'date'
            },
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Cara Pulang Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    @ViewChild('InformasiPasienComps') InformasiPasienComps!: InformasiPasienComponent;

    GridDetailProps: GridModel.IGrid = {
        id: 'GridDetailProps',
        column: [
            { field: 'nama_tarif', headerName: 'Nama Tarif', class: 'text-blue-500 font-semibold' },
            { field: 'qty_order', headerName: 'Qty Order', format: 'number' },
            { field: 'harga', headerName: 'Harga', format: 'currency' },
            { field: 'subtotal', headerName: 'Total', format: 'currency' },
            { field: 'dokter', headerName: 'Dokter' },
        ],
        dataSource: [],
        toolbar: ['Ubah Dokter'],
        height: "calc(100vh - 14.5rem)",
        showPaging: false,
        showSearch: false,
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Cara Pulang Disini'
    };
    GridDetailSelectedData: any;

    DokterDatasource: any[] = [];

    ShowDialogEditDokter = false;
    SelectedDokter: any;

    constructor(
        private _store: Store,
        private _router: Router,
        private _messageService: MessageService,
        private _radiologiService: RadiologiService,
        private _laboratoriumService: LaboratoriumService,
    ) {
        this.FormProps = {
            id: 'form_penjadwalan_order',
            fields: [
                {
                    id: 'id_order_penunjang',
                    label: 'ID Asal Rujukan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'tanggal_tes',
                    label: 'Tgl. Pemeriksaan',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_sample',
                    label: 'No. Sample',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_petugas',
                    label: 'Petugas',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                    },
                },

            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        const url = this._router.url;
        this.IsLaboratorium = url.includes('laboratorium');

        this.getAll({ page: 1, count: 5 });
        this.getAllNakes();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        if (this.IsLaboratorium) {
            this._laboratoriumService
                .getAllActive({ ...query, jenis_penunjang: 'Laboratorium' })
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data.rows;
                        this.GridProps.totalRows = result.data.totalRows;
                    }
                });
        } else {
            this._radiologiService
                .getAllActive({ ...query, jenis_penunjang: 'Radiologi' })
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data.rows;
                        this.GridProps.totalRows = result.data.totalRows;
                    }
                });
        }
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
                const indexPerawat = this.FormProps.fields.findIndex(item => item.id == 'id_petugas');
                if (indexPerawat > -1) {
                    this.FormProps.fields[indexPerawat].dropdownProps.options = options;
                }

                this.DokterDatasource = options;
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
            this.ButtonNavigation = [];
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
            this.InformasiPasienComps.getByIdRegister(args.id_register);
            args.tanggal_order_penunjang = formatDate(new Date(args.tanggal_order_penunjang), 'dd-MM-yyyy', 'EN');
            const tanggal_tes = new Date(args.tanggal_tes);
            args.tanggal_tes = formatDate(new Date(tanggal_tes.getTime() + (tanggal_tes.getTimezoneOffset() * 60000)), 'dd-MM-yyyy HH:mm', 'EN');
            this.FormComps.FormGroup.patchValue(args);
            this.getDetailOrderPenunjang(args.id_order_penunjang);
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'jadwalkan') {
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

    private getDetailOrderPenunjang(id_order_penunjang: string) {
        this._laboratoriumService
            .getById(id_order_penunjang)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.GridDetailProps.dataSource = result.data.detail_penunjang.map((item: any) => {
                        return {
                            ...item,
                            nama_tarif: item.tarif.nama_tarif
                        }
                    })
                }
            })
    }

    onCellDetailClicked(args: any): void {
        this.GridDetailSelectedData = args;
    }

    onToolbarDetailClicked(args: any): void {
        if (args.type == 'ubah dokter') {
            this.ShowDialogEditDokter = true;
        }
    }

    handleSaveDokter(args: any) {
        const index = this.GridDetailProps.dataSource.findIndex(item => item.id_order_penunjang_detail == this.GridDetailSelectedData.id_order_penunjang_detail);
        this.GridDetailProps.dataSource[index].dokter = args.nama;
        this.GridDetailProps.dataSource[index].id_dokter = args.id_nakes;
        this.ShowDialogEditDokter = false;
        this.SelectedDokter = null;
    }

    handleSaveVerifikasi(data: any) {
        const payload = {
            ...data,
            detail_penunjang: this.GridDetailProps.dataSource.map((item: any) => {
                return {
                    id_order_penunjang_detail: item.id_order_penunjang_detail,
                    id_dokter: item.id_dokter,
                }
            })
        }

        if (this.IsLaboratorium) {
            this._laboratoriumService
                .verifikasi(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                        this.handleBackToList();
                    }
                })
        } else {
            this._radiologiService
                .verifikasi(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                        this.handleBackToList();
                    }
                })
        }
    }

}
