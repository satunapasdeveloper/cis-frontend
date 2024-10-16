import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { FormPilihPasienForDokumenComponent } from 'src/app/components/form/form-pilih-pasien-for-dokumen/form-pilih-pasien-for-dokumen.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PilihPasienFormModel } from 'src/app/model/components/pilih-pasien-form.model';
import { RekamMedisModel } from 'src/app/model/pages/rekam-medis/rekam-medis.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { HeaderLayananDokumenComponent } from '../header-layanan-dokumen/header-layanan-dokumen.component';

@Component({
    selector: 'app-surat-sehat',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        HeaderLayananDokumenComponent,
        FormPilihPasienForDokumenComponent,
    ],
    templateUrl: './surat-sehat.component.html',
    styleUrl: './surat-sehat.component.scss'
})
export class SuratSehatComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    UserData$ = this._authenticationService
        .UserData$
        .pipe(takeUntil(this.Destroy$));

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'cetak',
            title: `Cetak`,
            icon: 'pi pi-print'
        }
    ];

    FormPilihPasienProps: PilihPasienFormModel.IForm = {
        id: 'surat_sehat',
        state: 'list',
        dynamic_form: {
            id: 'form_surat_sehat',
            class: 'grid-rows-11 grid-cols-1',
            style: 'not_inline',
            state: 'write',
            fields: [
                {
                    id: 'tanggal_visit',
                    label: 'Tanggal Visit',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'dokter',
                    label: 'Dokter',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'nama_lengkap',
                    label: 'Nama Pasien',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'tanggal_lahir',
                    label: 'Tanggal Lahir',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'jenis_kelamin',
                    label: 'Jenis Kelamin',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'pekerjaan',
                    label: 'Pekerjaan',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'alamat',
                    label: 'Alamat',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'berat_badan_tinggi_badan',
                    label: 'Berat Badan & Tinggi Badan',
                    required: false,
                    type: 'number_split',
                    value: '',
                    readonly: false,
                    splitProps: [
                        {
                            id: 'berat_badan',
                            required: false,
                        },
                        {
                            id: 'tinggi_badan',
                            required: false,
                        },
                    ]
                },
                {
                    id: 'sistole_distole',
                    label: 'Sistole & Distole',
                    required: false,
                    type: 'number_split',
                    value: '',
                    readonly: false,
                    splitProps: [
                        {
                            id: 'sistole',
                            required: false,
                        },
                        {
                            id: 'distole',
                            required: false,
                        },
                    ]
                },
                {
                    id: 'buta_warna',
                    label: 'Buta Warna',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'buta_warna',
                            label: 'Tidak',
                            value: 'Tidak',
                        },
                        {
                            name: 'buta_warna',
                            label: 'Iya',
                            value: 'Iya',
                        }
                    ],
                    value: '',
                    readonly: false
                },
                {
                    id: 'keterangan_lain',
                    label: 'Keterangan',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'tujuan',
                    label: 'Tujuan Pembuatan Surat Sehat',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'kondisi',
                    label: 'Kondisi',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'kondisi',
                            label: 'Sehat',
                            value: 'Sehat',
                        },
                        {
                            name: 'kondisi',
                            label: 'Tidak Sehat',
                            value: 'Tidak Sehat',
                        }
                    ],
                    value: '',
                    readonly: false
                },
            ]
        }
    };

    @ViewChild('FormPilihPasienForDokumenComps') FormPilihPasienForDokumenComps!: FormPilihPasienForDokumenComponent;

    SelectedRekamMedis!: RekamMedisModel.IRekamMedis;

    ShowRiwayatRekamMedis = false;

    FormValue = new BehaviorSubject<any>(null);

    constructor(
        private _store: Store,
        private _utilityService: UtilityService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.FormPilihPasienForDokumenComps
                .FormValue
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    console.log(result);
                    this.FormValue.next(result);
                })
        }, 1000);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(args: any) {
        if (args.id == 'cetak') {
            const el = document.getElementById('surat_sehat') as HTMLElement;

            if (el) {
                this._utilityService
                    .exportToPdf(
                        'surat_sehat',
                        `Surat Sehat - ${this.SelectedRekamMedis.nama_lengkap} - ${this.SelectedRekamMedis.no_rekam_medis}`
                    )
            }
        }
    }

    handleChooseRiwayatKunjungan(args: any) {
        this.SelectedRekamMedis = args;
    }

    formatDate(date: string): string {
        return formatDate(new Date(date), 'dd-MM-yyyy', 'EN');
    }
}   
