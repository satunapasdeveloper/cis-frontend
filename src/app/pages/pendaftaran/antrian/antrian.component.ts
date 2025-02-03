import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { map, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { SearchPasienDialogComponent } from 'src/app/components/dialog/search-pasien-dialog/search-pasien-dialog.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranService } from 'src/app/services/pendaftaran-klinik/pendaftaran/pendaftaran.service';
import { SetupPoliActions, SetupPoliState } from 'src/app/store/setup-data/setup-poli';
import { AntrianPoliklinikRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/antrian-poliklinik-rawat-jalan.service';
import { InputTextModule } from 'primeng/inputtext';
import { SetupNakesActions, SetupNakesState } from 'src/app/store/setup-data/nakes';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-antrian',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        TableModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        FormsModule,
        OverlayPanelModule,
        DialogModule,
        SearchPasienDialogComponent,
        ConfirmDialogModule,
        InputTextModule,
    ],
    templateUrl: './antrian.component.html',
    styleUrl: './antrian.component.scss'
})
export class AntrianComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    AntrianDatasource: any[] = [];
    AntrianQueryParams: any;

    PoliDatasource: any[] = [];

    DokterDatasource: any[] = [];

    TanggalAdmisiFilterSearch: any;
    PoliFilterSearch: any;
    DokterFilterSearch: any;
    PasienFilterSearch: any;

    SelectedPasien: any;
    ShowModalPanggilPasien: boolean = false;
    @ViewChild('SearchPasienDialogComps') SearchPasienDialogComps!: SearchPasienDialogComponent;

    constructor(
        private _store: Store,
        private _router: Router,
        private _pendaftaranService: PendaftaranService,
        private _confirmationService: ConfirmationService,
        private _antrianPoliklinikRawatJalanService: AntrianPoliklinikRawatJalanService,
    ) { }

    ngOnInit(): void {
        this.getAllPoli();
        this.getAllDokter();

        const filter = localStorage.getItem("_ANTRIAN_FILTER_SEARCH_") ? JSON.parse(localStorage.getItem("_ANTRIAN_FILTER_SEARCH_") as any) : null;

        if (filter) {
            this.handleSearchAntrian(filter.tanggal_admisi, filter.id_poli, filter.id_dokter, filter.nama_pasien);
        };
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.SearchPasienDialogComps.ShowDialog = true;
        };
    }

    private getAllPoli() {
        this._store
            .select(SetupPoliState.poliActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupPoliActions.GetAllActivePoli({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupPoliState.poliActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options: any) => {
                this.PoliDatasource = options;
            });
    }

    private getAllDokter() {
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
                this.DokterDatasource = options;
            });
    }

    handleSearchAntrian(tanggal_admisi: string, id_poli: string, id_dokter: string, nama_pasien: string) {
        this.AntrianQueryParams = {
            page: 1,
            count: 100,
            tanggal_admisi: formatDate(new Date(tanggal_admisi), 'yyyy-MM-dd', 'EN'),
        };

        if (tanggal_admisi) {
            this.TanggalAdmisiFilterSearch = new Date(tanggal_admisi);
        }

        if (id_poli) {
            this.PoliFilterSearch = id_poli;
            this.AntrianQueryParams = { ...this.AntrianQueryParams, id_poli: id_poli };
        };

        if (id_dokter) {
            this.DokterFilterSearch = id_dokter;
            this.AntrianQueryParams = { ...this.AntrianQueryParams, id_dokter: id_dokter };
        };

        if (nama_pasien) {
            this.PasienFilterSearch = nama_pasien;
            this.AntrianQueryParams = { ...this.AntrianQueryParams, nama_pasien: nama_pasien };
        };

        this._antrianPoliklinikRawatJalanService
            .getAll(this.AntrianQueryParams)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                localStorage.setItem('_ANTRIAN_FILTER_SEARCH_', JSON.stringify(this.AntrianQueryParams));
                this.AntrianDatasource = result.responseResult ? result.data.rows : [];
            })
    }

    handleFormatStatusAntrian(status: 'BELUM DIPANGGIL' | 'PANGGIL' | 'TIDAK HADIR' | 'PERIKSA' | 'SELESAI PERIKSA') {
        let classColor = 'bg-red-200 text-red-700';

        switch (status) {
            case 'TIDAK HADIR':
                classColor = 'bg-red-200 text-red-700';
                break;
            case 'BELUM DIPANGGIL':
                classColor = 'bg-orange-200 text-orange-700';
                break;
            case 'PANGGIL':
                classColor = 'bg-yellow-200 text-yellow-700';
                break;
            case 'PERIKSA':
                classColor = 'bg-sky-200 text-sky-700';
                break;
            case 'SELESAI PERIKSA':
                classColor = 'bg-emerald-200 text-emerald-700';
                break;
            default:
                break;
        }

        return classColor;
    }

    handleOpenDialogPanggil(data: any) {
        this.SelectedPasien = data;
        this.ShowModalPanggilPasien = true;

        !environment.production && console.log("panggil data pasien =>", data);
    }

    handleGoToAssesmentAwal(args: any) {
        localStorage.setItem('_SPSH_', JSON.stringify(args));
        setTimeout(() => {
            this._router.navigateByUrl(`/pelayanan-klinik/rekam-medis/assesment-awal?id_register=${args.id_register}`)
        }, 500);
    }

    handleGoToTransaksiPemasukan(args: any) {
        localStorage.setItem('_SPSH_', JSON.stringify(args));
        setTimeout(() => {
            this._router.navigateByUrl(`/pelayanan-klinik/rekam-medis/transaksi-pemasukan?id_register=${args.id_register}&jenis_rawat=J&id_poli=${args.id_poli}&id_kelas=${args.id_kelas_rawat}`)
        }, 500);
    }

    handleGoToBmhp(args: any) {
        localStorage.setItem('_SPSH_', JSON.stringify(args));
        setTimeout(() => {
            this._router.navigateByUrl(`/pelayanan-klinik/rekam-medis/bmhp?id_register=${args.id_register}&jenis_rawat=J&id_poli=${args.id_poli}&id_kelas=${args.id_kelas_rawat}`)
        }, 500);
    }

    handleGoToSuratKontrol(args: any) {
        localStorage.setItem('_SPSH_', JSON.stringify(args));
        setTimeout(() => {
            this._router.navigateByUrl(`/pelayanan-klinik/rekam-medis/surat-kontrol?id_register=${args.id_register}`)
        }, 500);
    }

    handleGoToSuratRujukan(args: any) {
        localStorage.setItem('_SPSH_', JSON.stringify(args));
        setTimeout(() => {
            this._router.navigateByUrl(`/pelayanan-klinik/rekam-medis/surat-rujukan-keluar?id_register=${args.id_register}`)
        }, 500);
    }

    handleGoToInputRekamMedis(args: any): void {
        setTimeout(() => {
            localStorage.setItem('_SPSH_', JSON.stringify(args));
            this._router.navigateByUrl(`/rekam-medis/baru?id=${args.id_pendaftaran}`)
        }, 500);
    }

    handlePanggilAntrian(id_register: string) {
        this._antrianPoliklinikRawatJalanService
            .panggil(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.onCallAntrian(this.SelectedPasien);
                    this.handleSearchAntrian(this.AntrianQueryParams.tanggal_admisi, this.AntrianQueryParams.id_poli, this.AntrianQueryParams.id_dokter, this.AntrianQueryParams.nama_pasien);
                }
            })
    }

    private onCallAntrian(data: any) {
        const voice: any = speechSynthesis.getVoices();
        const msg = new window.SpeechSynthesisUtterance();

        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1;
        msg.lang = "id-ID";
        msg.voice = voice.find((item: any) => { return item.name == 'Google Bahasa Indonesia' });

        msg.text = `Panggilan....Kepada....Nomor....antrian....${data.no_antrian},....pasien....${data.nama_pasien},....menuju....${data.nama_poli}`;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    }

    handleTidakHadirAntrian(id_register: string) {
        this._antrianPoliklinikRawatJalanService
            .tidakHadir(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.ShowModalPanggilPasien = false;
                    this.handleSearchAntrian(this.AntrianQueryParams.tanggal_admisi, this.AntrianQueryParams.id_poli, this.AntrianQueryParams.id_dokter, this.AntrianQueryParams.nama_pasien);
                }
            })
    }

    handleMulaiPeriksaAntrian(args: any) {
        if (args.status_register == 'PERIKSA') {
            this._router.navigateByUrl(`/pelayanan-klinik/rekam-medis/visit-pasien?id_register=${args.id_register}&jenis_rawat=J&id_poli=${args.id_poli}&id_kelas=${args.id_kelas_rawat}`)
        } else {
            this._antrianPoliklinikRawatJalanService
                .mulaiPeriksa(args.id_register)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this.ShowModalPanggilPasien = false;
                        this.handleSearchAntrian(this.AntrianQueryParams.tanggal_admisi, this.AntrianQueryParams.id_poli, this.AntrianQueryParams.id_dokter, this.AntrianQueryParams.nama_pasien);
                        this._router.navigateByUrl(`/pelayanan-klinik/rekam-medis/visit-pasien?id_register=${args.id_register}&jenis_rawat=J&id_poli=${args.id_poli}&id_kelas=${args.id_kelas_rawat}`)
                    }
                })
        }
    }
}
