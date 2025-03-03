import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranRawatInapService } from 'src/app/services/pelayanan-klinik/rawat-inap/pendaftaran-rawat-inap.service';
import { SuratPerintahRawatInapService } from 'src/app/services/pelayanan-klinik/rawat-inap/surat-perintah-rawat-inap.service';
import { NakesService } from 'src/app/services/pelayanan-klinik/setup-data/nakes.service';
import { PoliService } from 'src/app/services/pelayanan-klinik/setup-data/poli.service';
import { PasienService } from 'src/app/services/pendaftaran-klinik/pasien/pasien.service';

@Component({
    selector: 'app-surat-perintah-rawat-inap',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './surat-perintah-rawat-inap.component.html',
    styleUrl: './surat-perintah-rawat-inap.component.scss'
})
export class SuratPerintahRawatInapComponent implements OnInit, OnDestroy {

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
        id: 'SetupSpri',
        column: [
            { field: 'tanggal_rencana_inap', headerName: 'Tgl. Rencana Inap', class: 'text-blue-500 font-semibold' },
            { field: 'pasien.nama_pasien', headerName: 'Nama Pasien', },
            { field: 'pasien.no_rekam_medis', headerName: 'No. Rekam Medis', },
            { field: 'poli.nama_poli', headerName: 'Poliklinik' },
            { field: 'dokter.nama', headerName: 'Dokter' },
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
                id: 'tanggal_rencana_inap',
                placeholder: 'Cari Tgl. Rencana Inap Disini',
                type: 'date'
            },
            {
                id: 'nama_pasien',
                placeholder: 'Cari Nama Pasien Disini',
                type: 'text'
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

    KeywordPasien$ = new BehaviorSubject(null);

    constructor(
        private _poliService: PoliService,
        private _nakesService: NakesService,
        private _pasienService: PasienService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _pendaftaranRawatInapService: PendaftaranRawatInapService,
        private _suratPerintahRawatInapService: SuratPerintahRawatInapService,
    ) {
        this.FormProps = {
            id: 'form_setup_satuan',
            fields: [
                {
                    id: 'id_spri',
                    label: 'ID SPRI',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_pasien',
                    label: 'Pilih Pasien',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_pasien',
                        optionValue: 'id_pasien',
                        customField: {
                            title: 'nama_pasien',
                            subtitle: 'no_rekam_medis',
                            description: 'tanggal_lahir'
                        }
                    },
                    value: '',
                    onFilter: (args: any) => {
                        this.KeywordPasien$.next(args.filter);
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this.getDetailPasien(args.id_pasien);
                        }
                    }
                },
                {
                    id: 'no_kartu',
                    label: 'No. Kartu',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true
                },
                {
                    id: 'id_dokter',
                    label: 'Pilih Dokter',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.FormComps.FormGroup.get('kode_dokter')?.setValue(args.kode_dpjp)
                        }
                    }
                },
                {
                    id: 'kode_dokter',
                    label: 'Kode Dokter',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true
                },
                {
                    id: 'id_poli',
                    label: 'Pilih Poliklinik',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_poli',
                        optionValue: 'id_poli'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.FormComps.FormGroup.get('kode_poli_kontrol')?.setValue(args.kode_poli_bpjs)
                        }
                    }
                },
                {
                    id: 'kode_poli_kontrol',
                    label: 'Kode Dokter',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true
                },
                {
                    id: 'tanggal_rencana_inap',
                    label: 'Tgl. Rencana Inap',
                    required: true,
                    type: 'datetime',
                    value: '',
                    readonly: true
                },
                {
                    id: 'keterangan',
                    label: 'Keterangan',
                    required: true,
                    type: 'text',
                    value: '',
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
            class: 'grid-rows-5 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };

        this.KeywordPasien$
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged(),
            ).subscribe((result) => {
                this.getAllPasien(result);
            })
    }

    ngOnInit(): void {
        this.getAll({ page: 1, count: 5 });
        this.getAllPoli({ page: 1, count: 100 });
        this.getAllNakes({ page: 1, count: 100 });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        this._suratPerintahRawatInapService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                }
            });
    }

    private getAllPasien(keyword: any) {
        let queries: any = { page: 1, count: 100 };

        if (keyword && keyword.length) {
            queries.nama_pasien = keyword;
        }

        this._pasienService
            .getAll(queries)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_pasien');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                }
            });
    }

    private getDetailPasien(id_pasien: string) {
        this._pasienService
            .getById(id_pasien)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                if (result.responseResult) {
                    const penjaminBpjs = result.data.detail_penjamin.filter((item: any) => item.nama_penjamin == 'BPJS');

                    if (penjaminBpjs.length) {
                        this.FormComps.FormGroup.get('no_kartu')?.setValue(penjaminBpjs[0].nomor_penjamin);
                    } else {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'No. Kartu BPJS Pasien Tidak Ditemukan / Belum Terdaftar' })
                    }
                }
            })
    }

    private getAllPoli(query: any) {
        this._poliService
            .getAllActive(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_poli');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                }
            });
    }

    private getAllNakes(query: any) {
        this._nakesService
            .getAllActive(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_dokter');
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
                    this.updateStatusSpri(args.data);
                }
            });
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

    saveSpri(data: any) {
        delete data.id_spri;
        delete data.is_active;

        this._suratPerintahRawatInapService
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

    updateSpri(data: any) {
        this._suratPerintahRawatInapService
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

    private updateStatusSpri(data: any) {
        this._suratPerintahRawatInapService
            .updateStatus(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
                }
            })
    }

}
