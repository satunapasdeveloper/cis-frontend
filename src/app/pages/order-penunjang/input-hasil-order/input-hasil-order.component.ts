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
import { Subject, takeUntil, switchMap, of, take, map } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { MinioService } from 'src/app/services/minio/minio.service';
import { LaboratoriumService } from 'src/app/services/pelayanan-klinik/rekam-medis/laboratorium.service';
import { RadiologiService } from 'src/app/services/pelayanan-klinik/rekam-medis/radiologi.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { SetupNakesState, SetupNakesActions } from 'src/app/store/setup-data/nakes';

@Component({
    selector: 'app-input-hasil-order',
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
    templateUrl: './input-hasil-order.component.html',
    styleUrl: './input-hasil-order.component.scss'
})
export class InputHasilOrderComponent implements OnInit, OnDestroy {

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
        toolbar: ['Input Hasil'],
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

    DetailOrderPenunjang: any;

    GridDetailProps: GridModel.IGrid = {
        id: 'GridDetailProps',
        column: [
            { field: 'nama_tarif', headerName: 'Nama Tarif', class: 'text-blue-500 font-semibold' },
            { field: 'qty_order', headerName: 'Qty Order', format: 'number' },
            { field: 'harga', headerName: 'Harga', format: 'currency' },
            { field: 'subtotal', headerName: 'Total', format: 'currency' },
            { field: 'nama_dokter', headerName: 'Dokter' },
            { field: 'file_hasil_nama', headerName: 'File Hasil' },
        ],
        dataSource: [],
        toolbar: ['Unggah Hasil', 'Hapus Hasil'],
        height: "calc(100vh - 14.5rem)",
        showPaging: false,
        showSearch: false,
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Cara Pulang Disini'
    };
    GridDetailSelectedData: any;

    DokterDatasource: any[] = [];

    FormHasilProps: FormModel.IForm;
    @ViewChild('FormHasilComps') FormHasilComps!: DynamicFormComponent;

    ShowDialogHasilDetail = false;
    FormHasilDetailProps: FormModel.IForm;
    @ViewChild('FormHasilDetailComps') FormHasilDetailComps!: DynamicFormComponent;

    constructor(
        private _store: Store,
        private _router: Router,
        private _minioService: MinioService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
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
                    readonly: true,
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
                    readonly: true,
                },

            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };

        this.FormHasilProps = {
            id: 'form_file_hasil',
            fields: [
                {
                    id: 'file_hasil_tes',
                    label: 'Upload Baru File Hasil Pemeriksaan',
                    required: false,
                    type: 'fileinput',
                    file_accept: 'application/pdf',
                    value: '',
                    onChange: (files: File) => {
                        if (files) {
                            const type = files.name.split("."),
                                fileName = `${this.IsLaboratorium ? 'lab_hasil' : 'rad_hasil'}_${new Date().getTime()}.${type[1]}`;

                            this._minioService
                                .generatePresignedUrl('iptv', fileName)
                                .pipe(takeUntil(this.Destroy$))
                                .subscribe((result) => {
                                    if (result.data) {
                                        this.handleUploadFile(result.data, files, fileName);
                                    }
                                })
                        }
                    }
                },
                {
                    id: 'file_hasil_tes_url',
                    label: 'File URL',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'file_hasil_tes_nama',
                    label: 'File Name',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };

        this.FormHasilDetailProps = {
            id: 'form_file_hasil_detail',
            fields: [
                {
                    id: 'id_order_penunjang_detail',
                    label: 'Id Order Penunjang Detail',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'file_hasil',
                    label: 'Upload Baru File Hasil Detail Pemeriksaan',
                    required: false,
                    type: 'fileinput',
                    file_accept: 'application/pdf',
                    value: '',
                    onChange: (files: File) => {
                        if (files) {
                            const type = files.name.split("."),
                                fileName = `${this.IsLaboratorium ? 'lab_hasil_detail' : 'rad_hasil_detail'}_${new Date().getTime()}.${type[1]}`;

                            this._minioService
                                .generatePresignedUrl('iptv', fileName)
                                .pipe(takeUntil(this.Destroy$))
                                .subscribe((result) => {
                                    if (result.data) {
                                        this.handleUploadFileDetail(result.data, files, fileName);
                                    }
                                })
                        }
                    }
                },
                {
                    id: 'file_hasil_url',
                    label: 'File URL',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'file_hasil_nama',
                    label: 'File Name',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-1',
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
        if (args.type == 'input hasil') {
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
                    this.DetailOrderPenunjang = result.data;

                    this.GridDetailProps.dataSource = result.data.detail_penunjang.map((item: any) => {
                        return {
                            ...item,
                            nama_tarif: item.tarif.nama_tarif,
                            nama_dokter: item.dokter.nama
                        }
                    })
                }
            })
    }

    handleOpenFileHasil(url: string) {
        window.open(url);
    }

    private handleUploadFile(url: string, file: File, fileName: string) {
        this._utilityService.ShowLoading$.next(true);

        this._minioService
            .uploadFile(url, file)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                console.log("uploading file...");
                console.log("trying get url...");
                this.getUrlFileUploaded(fileName);
            })
    }

    private getUrlFileUploaded(fileName: string) {
        this._minioService
            .getUrlFile('iptv', fileName)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.data) {
                    this.FormHasilComps.FormGroup.get('file_hasil_tes_url')?.setValue(result.data);
                    this.FormHasilComps.FormGroup.get('file_hasil_tes_nama')?.setValue(fileName);
                    this._utilityService.ShowLoading$.next(false);
                    this.handleSaveHasilHeader();
                }
            })
    }

    private handleSaveHasilHeader() {
        const payload = {
            id_order_penunjang: this.FormComps.FormGroup.get('id_order_penunjang')?.value,
            file_hasil_tes_url: this.FormHasilComps.FormGroup.get('file_hasil_tes_url')?.value,
            file_hasil_tes_nama: this.FormHasilComps.FormGroup.get('file_hasil_tes_nama')?.value,
        };

        if (this.IsLaboratorium) {
            this._laboratoriumService
                .createHasilHeader(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Disimpan' });
                        this.getDetailOrderPenunjang(payload.id_order_penunjang);
                    }
                })
        } else {
            this._radiologiService
                .createHasilHeader(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Disimpan' });
                        this.getDetailOrderPenunjang(payload.id_order_penunjang);
                    }
                })
        }
    }

    handleCancelHasilHeader(id_order_penunjang: any) {
        if (this.IsLaboratorium) {
            this._laboratoriumService
                .deleteHasilHeader(id_order_penunjang)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Dihapus' });
                        this.getDetailOrderPenunjang(this.FormComps.FormGroup.get('id_order_penunjang')?.value);
                    }
                })
        } else {
            this._radiologiService
                .deleteHasilHeader(id_order_penunjang)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Dihapus' });
                        this.getDetailOrderPenunjang(this.FormComps.FormGroup.get('id_order_penunjang')?.value);
                    }
                })
        }
    }

    onCellDetailClicked(args: any): void {
        this.GridDetailSelectedData = args;
    }

    onToolbarDetailClicked(args: any): void {
        this.FormHasilDetailComps.FormGroup.get('id_order_penunjang_detail')?.setValue(args.data.id_order_penunjang_detail);

        if (args.type == 'unggah hasil') {
            this.ShowDialogHasilDetail = true;
        }

        if (args.type == 'hapus hasil') {
            this.handleCancelHasilDetail(args.data.id_order_penunjang_detail)
        }
    }

    private handleUploadFileDetail(url: string, file: File, fileName: string) {
        this._utilityService.ShowLoading$.next(true);

        this._minioService
            .uploadFile(url, file)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                console.log("uploading file...");
                console.log("trying get url...");
                this.getUrlFileUploadedDetail(fileName);
            })
    }

    private getUrlFileUploadedDetail(fileName: string) {
        this._minioService
            .getUrlFile('iptv', fileName)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.data) {
                    this.FormHasilDetailComps.FormGroup.get('file_hasil_url')?.setValue(result.data);
                    this.FormHasilDetailComps.FormGroup.get('file_hasil_nama')?.setValue(fileName);
                    this._utilityService.ShowLoading$.next(false);
                    this.handleSaveHasilDetail(this.FormHasilDetailComps.FormGroup.value);
                }
            })
    }


    handleSaveHasilDetail(args: any) {
        const { file_hasil, ...payload } = args;

        if (this.IsLaboratorium) {
            this._laboratoriumService
                .createHasilDetail(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Disimpan' });
                        this.FormHasilDetailComps.FormGroup.reset();
                        this.ShowDialogHasilDetail = false;
                        this.getDetailOrderPenunjang(this.FormComps.FormGroup.get('id_order_penunjang')?.value);
                    }
                })
        } else {
            this._radiologiService
                .createHasilDetail(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Disimpan' });
                        this.FormHasilDetailComps.FormGroup.reset();
                        this.ShowDialogHasilDetail = false;
                        this.getDetailOrderPenunjang(this.FormComps.FormGroup.get('id_order_penunjang')?.value);
                    }
                })
        }
    }

    handleCancelHasilDetail(id_order_penunjang_detail: any) {
        if (this.IsLaboratorium) {
            this._laboratoriumService
                .deleteHasilDetail(id_order_penunjang_detail)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Dihapus' });
                        this.getDetailOrderPenunjang(this.FormComps.FormGroup.get('id_order_penunjang')?.value);
                    }
                })
        } else {
            this._radiologiService
                .deleteHasilDetail(id_order_penunjang_detail)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Hasil Berhasil Dihapus' });
                        this.getDetailOrderPenunjang(this.FormComps.FormGroup.get('id_order_penunjang')?.value);
                    }
                })
        }
    }
}
