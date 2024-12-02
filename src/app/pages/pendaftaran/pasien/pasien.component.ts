import { CommonModule, formatDate, TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasienService } from 'src/app/services/pendaftaran-klinik/pasien/pasien.service';
import { LokasiService } from 'src/app/services/pelayanan-klinik/setup-data/lokasi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasienModel } from 'src/app/model/pages/pasien/pasien.model';

@Component({
    selector: 'app-pasien',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        FormsModule,
        InputSwitchModule,
        InputTextareaModule,
        ConfirmDialogModule
    ],
    templateUrl: './pasien.component.html',
    styleUrl: './pasien.component.scss'
})
export class PasienComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    IsFromOtherPage = false;

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'Pasien',
        column: [
            { field: 'no_rekam_medis', headerName: 'No. Rekam Medis', class: 'font-semibold' },
            { field: 'nama_pasien', headerName: 'Nama Lengkap', },
            { field: 'nik', headerName: 'NIK', },
            { field: 'tanggal_lahir', headerName: 'Tgl. Lahir', format: 'date' },
            { field: 'alamat_lengkap_domisili', headerName: 'Alamat', },
            { field: 'is_bayi_lahir', headerName: 'Pasien Bayi', renderAsCheckbox: true, class: 'text-center' },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Status', 'Detail'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'nik',
                placeholder: 'Cari NIK Disini',
                type: 'text'
            },
            {
                id: 'nama_pasien',
                placeholder: 'Cari Nama Pasien Disini',
                type: 'text'
            },
            {
                id: 'no_rekam_medis',
                placeholder: 'Cari No. Rekam Medis Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'nama_pasien',
        searchPlaceholder: 'Cari Nama Pasien Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormIdentitasProps: FormModel.IForm;
    @ViewChild('FormIdentitasComps') FormIdentitasComps!: DynamicFormComponent;

    FormIdentitasBayiProps!: FormModel.IForm;
    @ViewChild('FormIdentitasBayiComps') FormIdentitasBayiComps!: DynamicFormComponent;

    FormAlamatProps!: FormModel.IForm;
    @ViewChild('FormAlamatComps') FormAlamatComps!: DynamicFormComponent;

    FormAlamatDomisiliProps!: FormModel.IForm;
    @ViewChild('FormAlamatDomisiliComps') FormAlamatDomisiliComps!: DynamicFormComponent;

    FormLainLainProps!: FormModel.IForm;
    @ViewChild('FormLainLainComps') FormLainLainComps!: DynamicFormComponent;

    IsBayiLahir: boolean = false;

    Alamat: string = "";

    AlamatDomisili: string = "";

    IsAlamatDomisiliSame: boolean = false;

    constructor(
        private _store: Store,
        private _router: Router,
        private _pasienService: PasienService,
        private _lokasiService: LokasiService,
        private _titleCasePipe: TitleCasePipe,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormIdentitasProps = {
            id: 'form_identitas_pasien',
            fields: [
                {
                    id: 'nik',
                    label: 'NIK',
                    required: true,
                    type: 'text',
                    mask: '0000-0000-0000-0000',
                    dropSpecialCharacters: true,
                    value: '',
                },
                {
                    id: 'identitas_lain',
                    label: 'No. Identitas Lain (Khusus WNA)',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_pasien',
                    label: 'Nama Lengkap',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_ibu_kandung',
                    label: 'Nama Ibu Kandung',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'tempat_lahir',
                    label: 'Tempat Lahir',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'tanggal_lahir',
                    label: 'Tanggal Lahir',
                    required: false,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'gender',
                    label: 'Jenis Kelamin',
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
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormIdentitasBayiProps = {
            id: 'form_identitas_bayi',
            fields: [
                {
                    id: 'nik_ibu_kandung',
                    label: 'NIK Ibu Kandung',
                    required: true,
                    type: 'text',
                    mask: '0000-0000-0000-0000',
                    dropSpecialCharacters: true,
                    value: '',
                },
                {
                    id: 'nama_ibu_kandung',
                    label: 'Nama Ibu Kandung',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_pasien',
                    label: 'Nama Lengkap',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'tanggal_lahir',
                    label: 'Tanggal Lahir',
                    required: true,
                    type: 'datetime',
                    value: '',
                },
                {
                    id: 'gender',
                    label: 'Jenis Kelamin',
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
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormAlamatProps = {
            id: 'form_alamat',
            fields: [
                {
                    id: 'alamat_lengkap_ktp',
                    label: 'Alamat Lengkap',
                    required: true,
                    type: 'textarea',
                    textareaRow: 3,
                    value: '',
                    hidden: true,
                },
                {
                    id: 'kode_provinsi_ktp',
                    label: 'Provinsi',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKota(args.id);
                        } else {
                            this.FormAlamatComps.FormGroup.get('kode_kabupaten_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kecamatan_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(null);

                            this.FormAlamatProps.fields[2].dropdownProps.options = [];
                            this.FormAlamatProps.fields[3].dropdownProps.options = [];
                            this.FormAlamatProps.fields[4].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'kode_kabupaten_ktp',
                    label: 'Kota / Kabupaten',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKecamatan(args.id);
                        } else {
                            this.FormAlamatComps.FormGroup.get('kode_kecamatan_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(null);
                            this.FormAlamatProps.fields[3].dropdownProps.options = [];
                            this.FormAlamatProps.fields[4].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'kode_kecamatan_ktp',
                    label: 'Kecamatan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKelurahan(args.id);
                        } else {
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(null);
                            this.FormAlamatProps.fields[4].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'kode_kelurahan_ktp',
                    label: 'Kelurahan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                },
                {
                    id: 'kode_pos_ktp',
                    label: 'Kode Pos',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'rt/rw',
                    label: 'RT/RW',
                    required: true,
                    type: 'text_split',
                    splitProps: [
                        {
                            id: 'rt_ktp',
                            required: true,
                            value: '',
                        },
                        {
                            id: 'rw_ktp',
                            required: true,
                            value: '',
                        },
                    ],
                    value: '',
                },
                {
                    id: 'id_pasien',
                    label: 'Id Pasien',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormAlamatDomisiliProps = {
            id: 'form_alamat_domisili',
            fields: [
                {
                    id: 'alamat_lengkap_domisili',
                    label: 'Alamat Domisili',
                    required: true,
                    type: 'textarea',
                    textareaRow: 3,
                    value: '',
                    hidden: true,
                },
                {
                    id: 'kode_provinsi_domisili',
                    label: 'Provinsi',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKota(args.id);
                        } else {
                            this.FormAlamatComps.FormGroup.get('kode_kabupatan_domisili')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kecamatan_domisili')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(null);

                            this.FormAlamatProps.fields[2].dropdownProps.options = [];
                            this.FormAlamatProps.fields[3].dropdownProps.options = [];
                            this.FormAlamatProps.fields[4].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'kode_kabupatan_domisili',
                    label: 'Kota / Kabupaten',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKecamatan(args.id);
                        } else {
                            this.FormAlamatComps.FormGroup.get('kode_kecamatan_domisili')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(null);
                            this.FormAlamatProps.fields[3].dropdownProps.options = [];
                            this.FormAlamatProps.fields[4].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'kode_kecamatan_domisili',
                    label: 'Kecamatan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKelurahan(args.id);
                        } else {
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(null);
                            this.FormAlamatProps.fields[4].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'kode_kelurahan_domisili',
                    label: 'Kelurahan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                },
                {
                    id: 'kode_pos_domisili',
                    label: 'Kode Pos',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'rt/rw',
                    label: 'RT/RW',
                    required: true,
                    type: 'text_split',
                    splitProps: [
                        {
                            id: 'rt_domisili',
                            required: true,
                            value: '',
                        },
                        {
                            id: 'rw_domisili',
                            required: true,
                            value: '',
                        },
                    ],
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormLainLainProps = {
            id: 'form_lain_lain',
            fields: [
                {
                    id: 'no_telf',
                    label: 'No. HP',
                    required: false,
                    type: 'text',
                    mask: '0000-0000-00000',
                    dropSpecialCharacters: true,
                    value: '',
                },
                {
                    id: 'pendidikan_terakhir',
                    label: 'Pendidikan Terakhir',
                    required: false,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [
                            { value: 'SD', label: 'Sekolah Dasar (SD)' },
                            { value: 'SMP', label: 'Sekolah Menengah Pertama (SMP)' },
                            { value: 'SMA', label: 'Sekolah Menengah Atas (SMA)' },
                            { value: 'SMK', label: 'Sekolah Menengah Kejuruan (SMK)' },
                            { value: 'D3', label: 'Diploma (D3)' },
                            { value: 'D4', label: 'Diploma (D4)' },
                            { value: 'S1', label: 'Sarjana (S1)' },
                            { value: 'S2', label: 'Magister (S2)' },
                            { value: 'S3', label: 'Doktor (S3)' }
                        ],
                        optionName: 'label',
                        optionValue: 'value'
                    },
                },
                {
                    id: 'pekerjaan',
                    label: 'Pekerjaan',
                    required: false,
                    type: 'text',
                    value: '',
                    hidden: false
                },
                {
                    id: 'status_pernikahan',
                    label: 'Status Pernikahan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { value: 'Belum Kawin', label: 'Belum Kawin' },
                            { value: 'Kawin', label: 'Kawin' },
                            { value: 'Cerai Mati', label: 'Cerai Mati' },
                            { value: 'Cerai Hidup', label: 'Cerai Hidup' },
                        ],
                        optionName: 'label',
                        optionValue: 'value'
                    },
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll({ page: 1, count: 5 });
        this.getProvinsi();
    }

    ngAfterViewInit(): void {
        this.onCheckQueryParams();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private onCheckQueryParams() {
        const queryParams = this._activatedRoute.snapshot.queryParams;

        if (queryParams['from_url']) {
            setTimeout(() => {
                this.ButtonNavigation = [
                    {
                        id: 'back_to_from_url',
                        title: `Kembali Ke ${this._titleCasePipe.transform(queryParams['from_url'])}`,
                        icon: 'pi pi-chevron-left'
                    },
                    {
                        id: 'add',
                        title: 'Tambah',
                        icon: 'pi pi-plus'
                    }
                ]
            }, 100);
        } else {
            setTimeout(() => {
                this.ButtonNavigation = [
                    {
                        id: 'add',
                        title: 'Tambah',
                        icon: 'pi pi-plus'
                    }
                ]
            }, 100);
        }
    }

    private getAll(query: PasienModel.IPasienQueryParams) {
        this._pasienService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                }
            });
    }

    private getProvinsi() {
        this._lokasiService
            .getProvinsi()
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormAlamatProps.fields[1].dropdownProps.options = result.data;
                    this.FormAlamatDomisiliProps.fields[1].dropdownProps.options = result.data;
                }
            })
    }

    private getKota(id_provinsi: string, setValue?: boolean, id_kota?: string) {
        this._lokasiService
            .getKota(id_provinsi)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormAlamatProps.fields[2].dropdownProps.options = result.data;
                    this.FormAlamatDomisiliProps.fields[2].dropdownProps.options = result.data;

                    if (setValue) {
                        this.FormAlamatComps.FormGroup.get('kode_kabupaten_ktp')?.setValue(id_kota);

                        if (this.FormAlamatDomisiliComps) {
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kabupatan_domisili')?.setValue(id_kota);
                        }
                    }
                }
            })
    }

    private getKecamatan(id_kota: string, setValue?: boolean, id_kecamatan?: string) {
        this._lokasiService
            .getKecamatan(id_kota)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormAlamatProps.fields[3].dropdownProps.options = result.data;
                    this.FormAlamatDomisiliProps.fields[3].dropdownProps.options = result.data;

                    if (setValue) {
                        this.FormAlamatComps.FormGroup.get('kode_kecamatan_ktp')?.setValue(id_kecamatan);

                        if (this.FormAlamatDomisiliComps) {
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kecamatan_domisili')?.setValue(id_kecamatan);
                        }
                    }
                }
            })
    }

    private getKelurahan(id_kecamatan: string, setValue?: boolean, id_kelurahan?: string) {
        this._lokasiService
            .getKelurahan(id_kecamatan)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormAlamatProps.fields[4].dropdownProps.options = result.data;
                    this.FormAlamatDomisiliProps.fields[4].dropdownProps.options = result.data;

                    if (setValue) {
                        this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(id_kelurahan);

                        if (this.FormAlamatDomisiliComps) {
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(id_kelurahan);
                        }
                    }
                }
            })
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };

        const queryParams = this._activatedRoute.snapshot.queryParams;

        if (queryParams['from_url']) {
            if (data.id == 'back_to_from_url') {
                this._router.navigateByUrl(queryParams['from_url']);
            }
        }
    }

    handleBackToList() {
        if (this.IsBayiLahir) {
            this.FormIdentitasBayiComps.onResetForm();
        } else {
            this.FormIdentitasComps.onResetForm();
        };

        this.FormAlamatComps.onResetForm();

        if (!this.IsAlamatDomisiliSame) {
            this.FormAlamatDomisiliComps.onResetForm();
        }

        this.FormLainLainComps.onResetForm();

        this.PageState = 'list';

        this.onCheckQueryParams();

        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams })
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';

        setTimeout(() => {
            this.FormIdentitasComps.onResetForm();
            this.FormIdentitasBayiComps ? this.FormIdentitasBayiComps.onResetForm() : null;
            this.FormAlamatComps.onResetForm();
            this.FormAlamatDomisiliComps ? this.FormAlamatDomisiliComps.onResetForm() : null;
            this.FormLainLainComps.onResetForm();

            this.ButtonNavigation = [];

            this.getDetailPasien(args);
        }, 100);
    }

    private getDetailPasien(args: any) {
        args.tanggal_lahir = args.tanggal_lahir ? new Date(args.tanggal_lahir) : null;

        this.IsBayiLahir = args.is_bayi_lahir;

        setTimeout(() => {
            if (this.IsBayiLahir) {
                this.FormIdentitasBayiComps.FormGroup.patchValue(args);
            } else {
                this.FormIdentitasComps.FormGroup.patchValue(args);
            };

            this.setDropdownAlamats(args);

            setTimeout(() => {
                if (args.alamat_lengkap == args.alamat_lengkap_ktp) {
                    this.IsAlamatDomisiliSame = true;
                    this.Alamat = args.alamat_lengkap_ktp;
                    this.FormAlamatComps.FormGroup.patchValue(args);
                } else {
                    this.IsAlamatDomisiliSame = false;
                    this.Alamat = args.alamat_lengkap_ktp;
                    this.AlamatDomisili = args.alamat_lengkap;
                    this.FormAlamatComps.FormGroup.patchValue(args);
                    this.FormAlamatDomisiliComps.FormGroup.patchValue(args);
                };
            }, 1000);

            this.FormLainLainComps.FormGroup.patchValue(args);
        }, 100);
    }

    private setDropdownAlamats(data: any) {
        this.getKota(data.id_provinsi, true, data.id_kota);
        this.getKecamatan(data.id_kabupaten, true, data.id_kecamatan);
        this.getKelurahan(data.id_kecamatan, true, data.id_kelurahan);
    }

    onToolbarClicked(args: any): void {
        if (args.type == "ubah status") {
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
                    this.ubahStatusPasien(args.data.is_active);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams })
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams })
    }

    savePasien() {
        let alamat_form = this.FormAlamatComps.FormGroup.value,
            alamat_domisili_form = this.FormAlamatDomisiliComps ? this.FormAlamatDomisiliComps.FormGroup.value : null,
            identitas_form = this.FormIdentitasComps ? this.FormIdentitasComps.FormGroup.value : null,
            identitas_bayi_form = this.FormIdentitasBayiComps ? this.FormIdentitasBayiComps.FormGroup.value : null;

        delete alamat_form.id_pasien;

        alamat_form.alamat_lengkap_ktp = this.Alamat;

        if (identitas_bayi_form) {
            const tanggal_lahir = formatDate(identitas_bayi_form.tanggal_lahir, 'yyyy-MM-dd', 'EN');
            const jam_lahir = formatDate(identitas_bayi_form.jam_lahir, 'HH:mm:ss', 'EN');
            const waktu_lahir = `${tanggal_lahir}T${jam_lahir}.000Z`;

            identitas_bayi_form.tanggal_lahir = waktu_lahir;
        }

        const
            alamat_domisili = {
                alamat_lengkap_domisili: this.IsAlamatDomisiliSame ? alamat_form.alamat_lengkap_ktp : this.AlamatDomisili,
                kode_provinsi_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_provinsi_ktp : alamat_domisili_form.kode_provinsi_domisili,
                kode_kabupatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kabupaten_ktp : alamat_domisili_form.kode_kabupatan_domisili,
                kode_kecamatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kecamatan_ktp : alamat_domisili_form.kode_kecamatan_domisili,
                kode_kelurahan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kelurahan_ktp : alamat_domisili_form.kode_kelurahan_domisili,
                kode_pos: this.IsAlamatDomisiliSame ? alamat_form.kode_pos_ktp : alamat_domisili_form.kode_pos,
                rt_domisili: this.IsAlamatDomisiliSame ? alamat_form.rt_ktp : alamat_domisili_form.rt_domisili,
                rw_domisili: this.IsAlamatDomisiliSame ? alamat_form.rw_ktp : alamat_domisili_form.rw_domisili,
            },
            identitas = {
                nik: !this.IsBayiLahir ? identitas_form.nik : identitas_bayi_form.nik_ibu_kandung,
                identitas_lain: !this.IsBayiLahir ? identitas_form.identitas_lain : null,
                nama_pasien: !this.IsBayiLahir ? identitas_form.nama_pasien : identitas_bayi_form.nama_pasien,
                nik_ibu_kandung: !this.IsBayiLahir ? identitas_form.nama_ibu_kandung : identitas_bayi_form.nik_ibu_kandung,
                nama_ibu_kandung: !this.IsBayiLahir ? identitas_form.nama_ibu_kandung : identitas_bayi_form.nama_ibu_kandung,
                tempat_lahir: !this.IsBayiLahir ? identitas_form.tempat_lahir : "",
                tanggal_lahir: !this.IsBayiLahir ? identitas_form.tanggal_lahir : identitas_bayi_form.tanggal_lahir,
                gender: !this.IsBayiLahir ? identitas_form.gender : identitas_bayi_form.gender,
            };

        delete alamat_form['rt/rw'];

        const payload = {
            is_bayi_lahir: this.IsBayiLahir,
            ...identitas,
            ...alamat_form,
            ...alamat_domisili,
            ...this.FormLainLainComps.FormGroup.value,
        };

        console.log("payload =>", payload);

        // this._pasienService
        //     .create(payload)
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.responseResult) {
        //             this._messageService.clear();
        //             this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
        //             this.handleBackToList();
        //         }
        //     })
    }

    updatePasien() {
        let alamat_form = this.FormAlamatComps.FormGroup.value,
            alamat_domisili_form = this.FormAlamatDomisiliComps ? this.FormAlamatDomisiliComps.FormGroup.value : null,
            identitas_form = this.FormIdentitasComps ? this.FormIdentitasComps.FormGroup.value : null,
            identitas_bayi_form = this.FormIdentitasBayiComps ? this.FormIdentitasBayiComps.FormGroup.value : null;

        alamat_form.alamat_lengkap_ktp = this.Alamat;

        if (identitas_bayi_form) {
            const tanggal_lahir = formatDate(identitas_bayi_form.tanggal_lahir, 'yyyy-MM-dd', 'EN');
            const jam_lahir = formatDate(identitas_bayi_form.jam_lahir, 'HH:mm:ss', 'EN');
            const waktu_lahir = `${tanggal_lahir}T${jam_lahir}.000Z`;

            identitas_bayi_form.tanggal_lahir = waktu_lahir;
        }

        const
            alamat_domisili = {
                alamat_lengkap_domisili: this.IsAlamatDomisiliSame ? alamat_form.alamat_lengkap_ktp : this.AlamatDomisili,
                kode_provinsi_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_provinsi_ktp : alamat_domisili_form.kode_provinsi_domisili,
                kode_kabupatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kabupaten_ktp : alamat_domisili_form.kode_kabupatan_domisili,
                kode_kecamatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kecamatan_ktp : alamat_domisili_form.kode_kecamatan_domisili,
                kode_kelurahan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kelurahan_ktp : alamat_domisili_form.kode_kelurahan_domisili,
                kode_pos: this.IsAlamatDomisiliSame ? alamat_form.kode_pos_ktp : alamat_domisili_form.kode_pos,
                rt_domisili: this.IsAlamatDomisiliSame ? alamat_form.rt_ktp : alamat_domisili_form.rt_domisili,
                rw_domisili: this.IsAlamatDomisiliSame ? alamat_form.rw_ktp : alamat_domisili_form.rw_domisili,
            },
            identitas = {
                nik: !this.IsBayiLahir ? identitas_form.nik : identitas_bayi_form.nik_ibu_kandung,
                identitas_lain: !this.IsBayiLahir ? identitas_form.identitas_lain : null,
                nama_pasien: !this.IsBayiLahir ? identitas_form.nama_pasien : identitas_bayi_form.nama_pasien,
                nama_ibu_kandung: !this.IsBayiLahir ? identitas_form.nama_ibu_kandung : identitas_bayi_form.nama_pasien,
                tempat_lahir: !this.IsBayiLahir ? identitas_form.tempat_lahir : "",
                tanggal_lahir: !this.IsBayiLahir ? identitas_form.tanggal_lahir : identitas_bayi_form.tanggal_lahir,
                gender: !this.IsBayiLahir ? identitas_form.gender : identitas_bayi_form.gender,
            };

        delete alamat_form['rt/rw'];

        const payload = {
            is_bayi_lahir: this.IsBayiLahir,
            ...identitas,
            ...alamat_form,
            ...alamat_domisili,
            ...this.FormLainLainComps.FormGroup.value,
        };

        this._pasienService
            .update(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private ubahStatusPasien(is_active: boolean) {
        let alamat_form = this.FormAlamatComps.FormGroup.value,
            alamat_domisili_form = this.FormAlamatDomisiliComps ? this.FormAlamatDomisiliComps.FormGroup.value : null,
            identitas_form = this.FormIdentitasComps ? this.FormIdentitasComps.FormGroup.value : null,
            identitas_bayi_form = this.FormIdentitasBayiComps ? this.FormIdentitasBayiComps.FormGroup.value : null;

        alamat_form.alamat_lengkap_ktp = this.Alamat;

        if (identitas_bayi_form) {
            const tanggal_lahir = formatDate(identitas_bayi_form.tanggal_lahir, 'yyyy-MM-dd', 'EN');
            const jam_lahir = formatDate(identitas_bayi_form.jam_lahir, 'HH:mm:ss', 'EN');
            const waktu_lahir = `${tanggal_lahir}T${jam_lahir}.000Z`;

            identitas_bayi_form.tanggal_lahir = waktu_lahir;
        }

        const
            alamat_domisili = {
                alamat_lengkap_domisili: this.IsAlamatDomisiliSame ? alamat_form.alamat_lengkap_ktp : this.AlamatDomisili,
                kode_provinsi_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_provinsi_ktp : alamat_domisili_form.kode_provinsi_domisili,
                kode_kabupatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kabupaten_ktp : alamat_domisili_form.kode_kabupatan_domisili,
                kode_kecamatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kecamatan_ktp : alamat_domisili_form.kode_kecamatan_domisili,
                kode_kelurahan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kelurahan_ktp : alamat_domisili_form.kode_kelurahan_domisili,
                kode_pos: this.IsAlamatDomisiliSame ? alamat_form.kode_pos_ktp : alamat_domisili_form.kode_pos,
                rt_domisili: this.IsAlamatDomisiliSame ? alamat_form.rt_ktp : alamat_domisili_form.rt_domisili,
                rw_domisili: this.IsAlamatDomisiliSame ? alamat_form.rw_ktp : alamat_domisili_form.rw_domisili,
            },
            identitas = {
                nik: !this.IsBayiLahir ? identitas_form.nik : identitas_bayi_form.nik_ibu_kandung,
                identitas_lain: !this.IsBayiLahir ? identitas_form.identitas_lain : null,
                nama_pasien: !this.IsBayiLahir ? identitas_form.nama_pasien : identitas_bayi_form.nama_pasien,
                nama_ibu_kandung: !this.IsBayiLahir ? identitas_form.nama_ibu_kandung : identitas_bayi_form.nama_pasien,
                tempat_lahir: !this.IsBayiLahir ? identitas_form.tempat_lahir : "",
                tanggal_lahir: !this.IsBayiLahir ? identitas_form.tanggal_lahir : identitas_bayi_form.tanggal_lahir,
                gender: !this.IsBayiLahir ? identitas_form.gender : identitas_bayi_form.gender,
            };

        delete alamat_form['rt/rw'];

        const payload = {
            is_bayi_lahir: this.IsBayiLahir,
            ...identitas,
            ...alamat_form,
            ...alamat_domisili,
            ...this.FormLainLainComps.FormGroup.value,
            is_active: !is_active
        };

        this._pasienService
            .updateStatus(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
                    this.onCheckQueryParams();
                    this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams })
                }
            })
    }

}
