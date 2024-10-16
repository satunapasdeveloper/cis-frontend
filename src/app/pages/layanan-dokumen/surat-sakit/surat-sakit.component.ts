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
    selector: 'app-surat-sakit',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        HeaderLayananDokumenComponent,
        FormPilihPasienForDokumenComponent,
    ],
    templateUrl: './surat-sakit.component.html',
    styleUrl: './surat-sakit.component.scss'
})
export class SuratSakitComponent implements OnInit, AfterViewInit, OnDestroy {

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
        id: 'surat_sakit',
        state: 'list',
        dynamic_form: {
            id: 'form_surat_sakit',
            class: 'grid-rows-8 grid-cols-1',
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
                    id: 'dari_tanggal_sampai_tanggal',
                    label: 'Dari Tanggal Sampai Tanggal',
                    required: false,
                    type: 'daterange',
                    value: '',
                },
            ]
        }
    };

    @ViewChild('FormPilihPasienForDokumenComps') FormPilihPasienForDokumenComps!: FormPilihPasienForDokumenComponent;

    SelectedRekamMedis!: RekamMedisModel.IRekamMedis;

    ShowRiwayatRekamMedis = false;

    FormValue = new BehaviorSubject<any>(null);

    JumlahHari = 0;

    TanggalMulai: string = "";

    TanggalSelesai: string = "";

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
                    this.JumlahHari = this._utilityService.onCountJumlahHari(result.dari_tanggal_sampai_tanggal[0], result.dari_tanggal_sampai_tanggal[1]);
                    this.TanggalMulai = this._utilityService.onFormatDate(result.dari_tanggal_sampai_tanggal[0], 'DD MMMM yyyy');
                    this.TanggalSelesai = this._utilityService.onFormatDate(result.dari_tanggal_sampai_tanggal[1], 'DD MMMM yyyy');

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
            const el = document.getElementById('surat_sakit') as HTMLElement;

            if (el) {
                this._utilityService
                    .exportToPdf(
                        'surat_sakit',
                        `Surat Sakit - ${this.SelectedRekamMedis.nama_lengkap} - ${this.SelectedRekamMedis.no_rekam_medis}`
                    )

                // let originalContents = document.body.innerHTML;
                // document.body.innerHTML = el.innerHTML;
                // window.print();
                // document.body.innerHTML = originalContents;
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
