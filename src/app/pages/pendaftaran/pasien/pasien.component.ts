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
import { MinioService } from 'src/app/services/minio/minio.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { SetupPenjaminActions } from 'src/app/store/setup-data/penjamin';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-pasien',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        FormsModule,
        InputTextModule,
        InputSwitchModule,
        InputTextareaModule,
        ConfirmDialogModule,
        DropdownModule,
        CalendarModule,
        TooltipModule
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

    FormFoto: FormModel.IForm;
    @ViewChild('FormFotoComps') FormFotoComps!: DynamicFormComponent;

    IsBayiLahir: boolean = false;

    Alamat: string = "";

    AlamatDomisili: string = "";

    IsAlamatDomisiliSame: boolean = false;

    PenjaminDatasource: any[] = [];

    PenjaminPasien: any[] = [];

    constructor(
        private _store: Store,
        private _router: Router,
        private _minioService: MinioService,
        private _pasienService: PasienService,
        private _lokasiService: LokasiService,
        private _titleCasePipe: TitleCasePipe,
        private _activatedRoute: ActivatedRoute,
        private _utilityService: UtilityService,
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
                    id: 'id_pasien_satu_sehat',
                    label: 'Id Satu Sehat',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'wna',
                    label: 'WNA',
                    required: false,
                    type: 'text',
                    value: false,
                    hidden: true,
                },
                {
                    id: 'no_identitas_lain',
                    label: 'No. Identitas Lain (Khusus WNA)',
                    required: false,
                    type: 'text',
                    value: '',
                    onChange: (args: any) => {
                        this.FormIdentitasComps.FormGroup.get('wna')?.setValue(args ? true : false)
                    }
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
                {
                    id: 'golongan_darah',
                    label: 'Golongan Darah',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'A', value: 'A' },
                            { name: 'B', value: 'B' },
                            { name: 'AB', value: 'AB' },
                            { name: 'O', value: 'O' },
                        ],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: false,
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
                {
                    id: 'golongan_darah',
                    label: 'Golongan Darah',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'A', value: 'A' },
                            { name: 'B', value: 'B' },
                            { name: 'AB', value: 'AB' },
                            { name: 'O', value: 'O' },
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
                // 0
                {
                    id: 'alamat_lengkap_ktp',
                    label: 'Alamat Lengkap',
                    required: true,
                    type: 'textarea',
                    textareaRow: 3,
                    value: '',
                    hidden: true,
                },
                // 1
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
                            this.getKota(false, args.id);
                            this.FormAlamatComps.FormGroup.get('nama_provinsi_ktp')?.setValue(args.name);
                        } else {
                            this.FormAlamatComps.FormGroup.get('nama_provinsi_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kabupaten_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kecamatan_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(null);

                            this.FormAlamatProps.fields[3].dropdownProps.options = [];
                            this.FormAlamatProps.fields[5].dropdownProps.options = [];
                            this.FormAlamatProps.fields[7].dropdownProps.options = [];
                        }
                    },
                },
                // 2
                {
                    id: 'nama_provinsi_ktp',
                    label: 'Nama Provinsi',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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
                            this.getKecamatan(false, args.id);
                            this.FormAlamatComps.FormGroup.get('nama_kabupaten_ktp')?.setValue(args.name);
                        } else {
                            this.FormAlamatComps.FormGroup.get('nama_kabupaten_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kecamatan_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(null);
                            this.FormAlamatProps.fields[5].dropdownProps.options = [];
                            this.FormAlamatProps.fields[7].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'nama_kabupaten_ktp',
                    label: 'Nama Kabupaten',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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
                            this.getKelurahan(false, args.id);
                            this.FormAlamatComps.FormGroup.get('nama_kecamatan_ktp')?.setValue(args.name);
                        } else {
                            this.FormAlamatComps.FormGroup.get('nama_kecamatan_ktp')?.setValue(null);
                            this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(null);
                            this.FormAlamatProps.fields[7].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'nama_kecamatan_ktp',
                    label: 'Nama Kecamatan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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
                    onChange: (args: any) => {
                        if (args) {
                            this.FormAlamatComps.FormGroup.get('nama_kelurahan_ktp')?.setValue(args.name);
                        } else {
                            this.FormAlamatComps.FormGroup.get('nama_kelurahan_ktp')?.setValue(null);
                        }
                    },
                },
                {
                    id: 'nama_kelurahan_ktp',
                    label: 'Nama Kelurahan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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
                            this.getKota(true, args.id);
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_provinsi_domisili')?.setValue(args.name);
                        } else {
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_provinsi_domisili')?.setValue(null);
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kabupatan_domisili')?.setValue(null);
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kecamatan_domisili')?.setValue(null);
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(null);

                            this.FormAlamatDomisiliProps.fields[3].dropdownProps.options = [];
                            this.FormAlamatDomisiliProps.fields[5].dropdownProps.options = [];
                            this.FormAlamatDomisiliProps.fields[7].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'nama_provinsi_domisili',
                    label: 'Nama Provinsi',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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
                            this.getKecamatan(true, args.id);
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_kabupaten_domisili')?.setValue(args.name);
                        } else {
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_kabupaten_domisili')?.setValue(null);
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kecamatan_domisili')?.setValue(null);
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(null);
                            this.FormAlamatDomisiliProps.fields[5].dropdownProps.options = [];
                            this.FormAlamatDomisiliProps.fields[7].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'nama_kabupaten_domisili',
                    label: 'Nama Kabupaten',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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
                            this.getKelurahan(true, args.id);
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_kecamatan_domisili')?.setValue(args.name);
                        } else {
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_kecamatan_domisili')?.setValue(null);
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(null);
                            this.FormAlamatDomisiliProps.fields[7].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'nama_kecamatan_domisili',
                    label: 'Nama Kecamatan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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
                    onChange: (args: any) => {
                        if (args) {
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_kelurahan_domisili')?.setValue(args.name);
                        } else {
                            this.FormAlamatDomisiliComps.FormGroup.get('nama_kelurahan_domisili')?.setValue(null);
                        }
                    },
                },
                {
                    id: 'nama_kelurahan_domisili',
                    label: 'Nama Kelurahan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
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

        this.FormFoto = {
            id: 'form_foto_nakes',
            fields: [
                {
                    id: 'file_foto',
                    label: 'Foto',
                    required: false,
                    type: 'fileinput',
                    file_accept: 'image/*',
                    value: '',
                    onChange: (files: File) => {
                        if (files) {
                            const type = files.name.split("."),
                                fileName =
                                    this.FormState == 'insert' ?
                                        `pasien_${new Date().getTime()}.${type[1]}` :
                                        (this.FormFotoComps.FormGroup.get('file_foto_name')?.value ?
                                            this.FormFotoComps.FormGroup.get('file_foto_name')?.value :
                                            `pasien_${new Date().getTime()}.${type[1]}`);

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
                    id: 'file_foto_url',
                    label: 'Image URL',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'file_foto_name',
                    label: 'Image Name',
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
        this.getAll({ page: 1, count: 5 });
        this.getProvinsi();
        this.getAllActivePenjamin();
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

    private getKota(is_domisili: boolean, id_provinsi: string, setValue?: boolean, id_kota?: string) {
        this._lokasiService
            .getKota(id_provinsi)
            .subscribe((result) => {
                if (result.responseResult) {
                    if (!is_domisili) {
                        this.FormAlamatProps.fields[3].dropdownProps.options = result.data;
                    } else {
                        this.FormAlamatDomisiliProps.fields[3].dropdownProps.options = result.data;
                    }

                    if (setValue) {
                        this.FormAlamatComps.FormGroup.get('kode_kabupaten_ktp')?.setValue(id_kota);

                        if (this.FormAlamatDomisiliComps) {
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kabupatan_domisili')?.setValue(id_kota);
                        }
                    }
                }
            })
    }

    private getKecamatan(is_domisili: boolean, id_kota: string, setValue?: boolean, id_kecamatan?: string) {
        this._lokasiService
            .getKecamatan(id_kota)
            .subscribe((result) => {
                if (result.responseResult) {
                    if (!is_domisili) {
                        this.FormAlamatProps.fields[5].dropdownProps.options = result.data;
                    } else {
                        this.FormAlamatDomisiliProps.fields[5].dropdownProps.options = result.data;
                    }

                    if (setValue) {
                        this.FormAlamatComps.FormGroup.get('kode_kecamatan_ktp')?.setValue(id_kecamatan);

                        if (this.FormAlamatDomisiliComps) {
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kecamatan_domisili')?.setValue(id_kecamatan);
                        }
                    }
                }
            })
    }

    private getKelurahan(is_domisili: boolean, id_kecamatan: string, setValue?: boolean, id_kelurahan?: string) {
        this._lokasiService
            .getKelurahan(id_kecamatan)
            .subscribe((result) => {
                if (result.responseResult) {
                    if (!is_domisili) {
                        this.FormAlamatProps.fields[7].dropdownProps.options = result.data;
                    } else {
                        this.FormAlamatDomisiliProps.fields[7].dropdownProps.options = result.data;
                    }

                    if (setValue) {
                        this.FormAlamatComps.FormGroup.get('kode_kelurahan_ktp')?.setValue(id_kelurahan);

                        if (this.FormAlamatDomisiliComps) {
                            this.FormAlamatDomisiliComps.FormGroup.get('kode_kelurahan_domisili')?.setValue(id_kelurahan);
                        }
                    }
                }
            })
    }

    private getAllActivePenjamin() {
        this._store
            .dispatch(new SetupPenjaminActions.GetAllActivePenjamin({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_penjamin.actives) {
                    this.PenjaminDatasource = result.setup_penjamin.actives;
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
            this.PenjaminPasien = [];
            this.ButtonNavigation = [];

            this.getDetailPasien(args);
        }, 100);
    }

    private getDetailPasien(data: any) {
        this._pasienService
            .getById(data.id_pasien)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                const args = result.data as any;

                args.tanggal_lahir = args.tanggal_lahir ? new Date(args.tanggal_lahir) : null;
                this.IsBayiLahir = args.is_bayi_lahir;

                setTimeout(() => {
                    if (this.IsBayiLahir) {
                        this.FormIdentitasBayiComps.FormGroup.patchValue(args);
                    } else {
                        this.FormIdentitasComps.FormGroup.patchValue(args);
                    };

                    this.setDropdownAlamats(args.alamat_lengkap_domisili == args.alamat_lengkap_ktp, args);

                    setTimeout(() => {
                        if (args.alamat_lengkap_domisili == args.alamat_lengkap_ktp) {
                            this.IsAlamatDomisiliSame = true;
                            this.Alamat = args.alamat_lengkap_ktp;
                            this.FormAlamatComps.FormGroup.patchValue(args);
                        } else {
                            this.IsAlamatDomisiliSame = false;
                            this.Alamat = args.alamat_lengkap_ktp;
                            this.AlamatDomisili = args.alamat_lengkap_ktp;
                            this.FormAlamatComps.FormGroup.patchValue(args);
                            this.FormAlamatDomisiliComps.FormGroup.patchValue(args);
                        };
                    }, 1000);

                    this.FormLainLainComps.FormGroup.patchValue(args);
                    this.FormFotoComps.FormGroup.patchValue(args);
                    this.FormFotoComps.ImagePreviews['file_foto'] = args.file_foto_url;

                    this.PenjaminPasien = args.detail_penjamin.map((item: any) => {
                        return {
                            ...item,
                            tanggal_berlaku: new Date(item.tanggal_berlaku),
                            tanggal_expired: new Date(item.tanggal_expired),
                        }
                    }).filter((item: any) => item.is_active == true);
                }, 100);
            })
    }

    private setDropdownAlamats(is_domisili: boolean, data: any) {
        this.getKota(false, data.kode_provinsi_ktp, true, data.kode_kabupaten_ktp);
        this.getKecamatan(false, data.kode_kabupaten_ktp, true, data.kode_kecamatan_ktp);
        this.getKelurahan(false, data.kode_kecamatan_ktp, true, data.kode_kelurahan_ktp);

        if (is_domisili) {
            this.getKota(true, data.kode_provinsi_domisili, true, data.kode_kabupatan_domisili);
            this.getKecamatan(true, data.kode_kabupatan_domisili, true, data.kode_kecamatan_domisili);
            this.getKelurahan(true, data.kode_kecamatan_domisili, true, data.kode_kelurahan_domisili);
        }
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
                    this.ubahStatusPasien(args.data);
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
                    this.FormFotoComps.FormGroup.get('file_foto_url')?.setValue(result.data);
                    this.FormFotoComps.FormGroup.get('file_foto_name')?.setValue(fileName);
                    this._utilityService.ShowLoading$.next(false);
                }
            })
    }

    handleAddNewPenjamin() {
        this.PenjaminPasien.push({
            id_penjamin: 0,
            nama_penjamin: "",
            nomor_penjamin: '',
            tanggal_berlaku: '',
            tanggal_expired: '',
            is_default: this.PenjaminPasien.length < 1 ? true : false,
            is_active: true,
        });
    }

    handleDeletePenjamin(index: number) {
        if (this.PenjaminPasien[index].id_pasien_penjamin) {
            const payload = {
                id_pasien_penjamin: this.PenjaminPasien[index].id_pasien_penjamin,
                id_penjamin: this.PenjaminPasien[index].id_penjamin,
                nama_penjamin: this.PenjaminPasien[index].nama_penjamin,
                nomor_penjamin: this.PenjaminPasien[index].nomor_penjamin,
                tanggal_berlaku: this.PenjaminPasien[index].tanggal_berlaku,
                tanggal_expired: this.PenjaminPasien[index].tanggal_expired,
                is_default: false,
                is_active: false,
            };

            this._pasienService
                .updatePenjamin(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Penjamin Berhasil Dihapus' });
                        this.getDetailPasien({ id_pasien: this.FormAlamatComps.FormGroup.get('id_pasien')?.value });
                    }
                })
        } else {
            if (this.PenjaminPasien.length > 1) {
                this.PenjaminPasien.splice(index, 1);
            }
        }
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
            const jam_lahir = formatDate(identitas_bayi_form.tanggal_lahir, 'HH:mm:ss', 'EN');
            const waktu_lahir = `${tanggal_lahir}T${jam_lahir}.000Z`;

            identitas_bayi_form.tanggal_lahir = waktu_lahir;
        }

        const
            alamat_domisili = {
                alamat_lengkap_domisili: this.IsAlamatDomisiliSame ? alamat_form.alamat_lengkap_ktp : this.AlamatDomisili,
                kode_provinsi_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_provinsi_ktp : alamat_domisili_form.kode_provinsi_domisili,
                nama_provinsi_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_provinsi_ktp : alamat_domisili_form.nama_provinsi_domisili,
                kode_kabupatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kabupaten_ktp : alamat_domisili_form.kode_kabupatan_domisili,
                nama_kabupaten_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_kabupaten_ktp : alamat_domisili_form.nama_kabupaten_domisili,
                kode_kecamatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kecamatan_ktp : alamat_domisili_form.kode_kecamatan_domisili,
                nama_kecamatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_kecamatan_ktp : alamat_domisili_form.nama_kecamatan_domisili,
                kode_kelurahan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kelurahan_ktp : alamat_domisili_form.kode_kelurahan_domisili,
                nama_kelurahan_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_kelurahan_ktp : alamat_domisili_form.nama_kelurahan_domisili,
                kode_pos_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_pos_ktp : alamat_domisili_form.kode_pos_domisili,
                rt_domisili: this.IsAlamatDomisiliSame ? alamat_form.rt_ktp : alamat_domisili_form.rt_domisili,
                rw_domisili: this.IsAlamatDomisiliSame ? alamat_form.rw_ktp : alamat_domisili_form.rw_domisili,
            },
            identitas = {
                nik: !this.IsBayiLahir ? identitas_form.nik : identitas_bayi_form.nik_ibu_kandung,
                id_pasien_satu_sehat: !this.IsBayiLahir ? identitas_form.id_pasien_satu_sehat : "",
                wna: !this.IsBayiLahir ? (identitas_form.wna ? identitas_form.wna : false) : false,
                identitas_lain: !this.IsBayiLahir ? identitas_form.identitas_lain : "",
                nama_pasien: !this.IsBayiLahir ? identitas_form.nama_pasien : identitas_bayi_form.nama_pasien,
                nik_ibu_kandung: !this.IsBayiLahir ? identitas_form.nik_ibu_kandung : identitas_bayi_form.nik_ibu_kandung,
                nama_ibu_kandung: !this.IsBayiLahir ? identitas_form.nama_ibu_kandung : identitas_bayi_form.nama_ibu_kandung,
                tempat_lahir: !this.IsBayiLahir ? identitas_form.tempat_lahir : "",
                tanggal_lahir: !this.IsBayiLahir ? identitas_form.tanggal_lahir : identitas_bayi_form.tanggal_lahir,
                gender: !this.IsBayiLahir ? identitas_form.gender : identitas_bayi_form.gender,
                golongan_darah: !this.IsBayiLahir ? identitas_form.golongan_darah : identitas_bayi_form.golongan_darah,
            };

        delete alamat_form['rt/rw'];

        const payload = {
            is_bayi_lahir: this.IsBayiLahir,
            ...identitas,
            ...alamat_form,
            ...alamat_domisili,
            ...this.FormLainLainComps.FormGroup.value,
            ...this.FormFotoComps.FormGroup.value,
            detail_penjamin: this.PenjaminPasien.map((item: any) => {
                const nama_penjamin = this.PenjaminDatasource.find(data => data.id_penjamin == item.id_penjamin).nama_penjamin;

                return {
                    ...item,
                    nama_penjamin: nama_penjamin
                }
            })
        };

        this._pasienService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updatePasien() {
        let alamat_form = this.FormAlamatComps.FormGroup.value,
            alamat_domisili_form = this.FormAlamatDomisiliComps ? this.FormAlamatDomisiliComps.FormGroup.value : null,
            identitas_form = this.FormIdentitasComps ? this.FormIdentitasComps.FormGroup.value : null,
            identitas_bayi_form = this.FormIdentitasBayiComps ? this.FormIdentitasBayiComps.FormGroup.value : null;

        alamat_form.alamat_lengkap_ktp = this.Alamat;

        if (identitas_bayi_form) {
            const tanggal_lahir = formatDate(identitas_bayi_form.tanggal_lahir, 'yyyy-MM-dd', 'EN');
            const jam_lahir = formatDate(identitas_bayi_form.tanggal_lahir, 'HH:mm:ss', 'EN');
            const waktu_lahir = `${tanggal_lahir}T${jam_lahir}.000Z`;

            identitas_bayi_form.tanggal_lahir = waktu_lahir;
        }

        const
            alamat_domisili = {
                alamat_lengkap_domisili: this.IsAlamatDomisiliSame ? alamat_form.alamat_lengkap_ktp : this.AlamatDomisili,
                kode_provinsi_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_provinsi_ktp : alamat_domisili_form.kode_provinsi_domisili,
                nama_provinsi_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_provinsi_ktp : alamat_domisili_form.nama_provinsi_domisili,
                kode_kabupatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kabupaten_ktp : alamat_domisili_form.kode_kabupatan_domisili,
                nama_kabupaten_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_kabupaten_ktp : alamat_domisili_form.nama_kabupaten_domisili,
                kode_kecamatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kecamatan_ktp : alamat_domisili_form.kode_kecamatan_domisili,
                nama_kecamatan_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_kecamatan_ktp : alamat_domisili_form.nama_kecamatan_domisili,
                kode_kelurahan_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_kelurahan_ktp : alamat_domisili_form.kode_kelurahan_domisili,
                nama_kelurahan_domisili: this.IsAlamatDomisiliSame ? alamat_form.nama_kelurahan_ktp : alamat_domisili_form.nama_kelurahan_domisili,
                kode_pos_domisili: this.IsAlamatDomisiliSame ? alamat_form.kode_pos_ktp : alamat_domisili_form.kode_pos_domisili,
                rt_domisili: this.IsAlamatDomisiliSame ? alamat_form.rt_ktp : alamat_domisili_form.rt_domisili,
                rw_domisili: this.IsAlamatDomisiliSame ? alamat_form.rw_ktp : alamat_domisili_form.rw_domisili,
            },
            identitas = {
                nik: !this.IsBayiLahir ? identitas_form.nik : identitas_bayi_form.nik_ibu_kandung,
                id_pasien_satu_sehat: !this.IsBayiLahir ? identitas_form.id_pasien_satu_sehat : "",
                wna: !this.IsBayiLahir ? (identitas_form.wna ? identitas_form.wna : false) : false,
                identitas_lain: !this.IsBayiLahir ? identitas_form.identitas_lain : "",
                nama_pasien: !this.IsBayiLahir ? identitas_form.nama_pasien : identitas_bayi_form.nama_pasien,
                nik_ibu_kandung: !this.IsBayiLahir ? identitas_form.nik_ibu_kandung : identitas_bayi_form.nik_ibu_kandung,
                nama_ibu_kandung: !this.IsBayiLahir ? identitas_form.nama_ibu_kandung : identitas_bayi_form.nama_ibu_kandung,
                tempat_lahir: !this.IsBayiLahir ? identitas_form.tempat_lahir : "",
                tanggal_lahir: !this.IsBayiLahir ? identitas_form.tanggal_lahir : identitas_bayi_form.tanggal_lahir,
                gender: !this.IsBayiLahir ? identitas_form.gender : identitas_bayi_form.gender,
                golongan_darah: !this.IsBayiLahir ? identitas_form.golongan_darah : identitas_bayi_form.golongan_darah,
                is_active: identitas_form.is_active,
            };

        delete alamat_form['rt/rw'];

        const payload = {
            is_bayi_lahir: this.IsBayiLahir,
            ...identitas,
            ...alamat_form,
            ...alamat_domisili,
            ...this.FormLainLainComps.FormGroup.value,
            ...this.FormFotoComps.FormGroup.value,
            detail_penjamin: this.PenjaminPasien.map((item: any) => {
                const nama_penjamin = this.PenjaminDatasource.find(data => data.id_penjamin == item.id_penjamin).nama_penjamin;

                return {
                    ...item,
                    nama_penjamin: nama_penjamin
                }
            })
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

    private ubahStatusPasien(data: any) {
        this._pasienService
            .updateStatus(data)
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

    handleSavePenjamin(index: number) {
        const payload = {
            id_pasien: this.FormAlamatComps.FormGroup.get('id_pasien')?.value,
            detail_penjamin: [
                this.PenjaminPasien[index]
            ]
        };

        this._pasienService
            .createPenjamin(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Penjamin Berhasil Disimpan' });
                    this.getDetailPasien({ id_pasien: this.FormAlamatComps.FormGroup.get('id_pasien')?.value });
                }
            })
    }

    handleUpdatePenjamin(index: number) {
        const payload = {
            id_pasien_penjamin: this.PenjaminPasien[index].id_pasien_penjamin,
            id_penjamin: this.PenjaminPasien[index].id_penjamin,
            nama_penjamin: this.PenjaminPasien[index].nama_penjamin,
            nomor_penjamin: this.PenjaminPasien[index].nomor_penjamin,
            tanggal_berlaku: this.PenjaminPasien[index].tanggal_berlaku,
            tanggal_expired: this.PenjaminPasien[index].tanggal_expired,
            is_default: this.PenjaminPasien[index].is_default,
            is_active: this.PenjaminPasien[index].is_active,
        };

        this._pasienService
            .updatePenjamin(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Penjamin Berhasil Diperbarui' });
                    this.getDetailPasien({ id_pasien: this.FormAlamatComps.FormGroup.get('id_pasien')?.value });
                }
            })
    }
}
