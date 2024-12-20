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
import { count, Subject, takeUntil } from 'rxjs';
import { SearchPasienDialogComponent } from 'src/app/components/dialog/search-pasien-dialog/search-pasien-dialog.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranService } from 'src/app/services/pendaftaran-klinik/pendaftaran/pendaftaran.service';
import { RekamMedisService } from 'src/app/services/pelayanan-klinik/rekam-medis/rekam-medis.service';
import { RekamMedisActions } from 'src/app/store/rekam-medis';
import { SetupPoliState } from 'src/app/store/setup-data/setup-poli';
import { AntrianPoliklinikRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/antrian-poliklinik-rawat-jalan.service';
import { InputTextModule } from 'primeng/inputtext';

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
            .select(SetupPoliState.poliEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.PoliDatasource = result;
            })
    }

    handleSearchAntrian(tanggal_admisi: string, id_poli: string, id_dokter: string, nama_pasien: string) {
        this.AntrianQueryParams = {
            page: 1,
            count: 100,
            tanggal_admisi: formatDate(new Date(tanggal_admisi), 'yyyy-MM-dd', 'EN'),
        };

        if (id_poli) {
            this.AntrianQueryParams = { ...this.AntrianQueryParams, id_poli: id_poli }
        };

        if (id_dokter) {
            this.AntrianQueryParams = { ...this.AntrianQueryParams, id_dokter: id_dokter }
        };

        if (nama_pasien) {
            this.AntrianQueryParams = { ...this.AntrianQueryParams, nama_pasien: nama_pasien }
        };

        this._antrianPoliklinikRawatJalanService
            .getAll(this.AntrianQueryParams)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                localStorage.setItem('_ANTRIAN_FILTER_SEARCH_', JSON.stringify(this.AntrianQueryParams));
                this.AntrianDatasource = result.responseResult ? result.data.rows : [];
                console.log("antrian datasource =>", this.AntrianDatasource);
            })
    }

    handleFormatStatusAntrian(status: 'TIDAK HADIR' | 'MENUNGGU/BELUM DI PANGGIL' | 'MEMANGGIL' | 'SEDANG DI PERIKSA' | 'PULANG') {
        let classColor = 'bg-red-200 text-red-700';

        switch (status) {
            case 'TIDAK HADIR':
                classColor = 'bg-red-200 text-red-700';
                break;
            case 'MENUNGGU/BELUM DI PANGGIL':
                classColor = 'bg-orange-200 text-orange-700';
                break;
            case 'MEMANGGIL':
                classColor = 'bg-yellow-200 text-yellow-700';
                break;
            case 'SEDANG DI PERIKSA':
                classColor = 'bg-sky-200 text-sky-700';
                break;
            case 'PULANG':
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

        setTimeout(() => {
            this.onUpdateStatusPasien(data.id_pendaftaran, 3);
            this.onCallAntrian(data);
        }, 200);
    }

    onCallAntrian(data: any) {
        const voice: any = speechSynthesis.getVoices();
        const msg = new window.SpeechSynthesisUtterance();

        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1;
        msg.lang = "id-ID";
        msg.voice = voice.find((item: any) => { return item.name == 'Google Bahasa Indonesia' });

        msg.text = `Panggilan....Kepada....Nomor....antrian....${data.no_antrian},....pasien....${data.nama_lengkap},....menuju....${data.poli}`;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    }

    handleSelectLookupPasien(args: any) {
        localStorage.setItem('_SPSH_', JSON.stringify(args));
        this._router.navigateByUrl(`/antrian/tambah?no_rm=${args.no_rekam_medis}`)
    }

    handleGoToAssesmentAwal(args: any) {
        localStorage.setItem('_SPSH_', JSON.stringify(args));
        this._router.navigateByUrl(`/antrian/assesment-awal?id=${args.id_pendaftaran}`)
    }

    handleGoToInputRekamMedis(args: any): void {
        this.onUpdateStatusPasien(args.id_pendaftaran, 4);
        setTimeout(() => {
            localStorage.setItem('_SPSH_', JSON.stringify(args));
            this._router.navigateByUrl(`/rekam-medis/baru?id=${args.id_pendaftaran}`)
        }, 500);
    }

    handleCancelAntrian(args: any): void {
        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            message: 'Data yang dihapus tidak bisa dikembalikan',
            header: 'Apakah Anda Yakin?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Iya Saya Yakin',
            rejectIcon: "none",
            rejectLabel: 'Tidak, Kembali',
            accept: () => {
                this._pendaftaranService
                    .cancel(args.id_pendaftaran)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.responseResult) {
                            const prevFilter = JSON.parse(localStorage.getItem('_ANTRIAN_FILTER_SEARCH_') as any);
                            if (prevFilter) {
                                this._store
                                    .dispatch(new RekamMedisActions.GetAllRekamMedis(prevFilter))
                                    .pipe(takeUntil(this.Destroy$))
                                    .subscribe((result) => {
                                        this.AntrianDatasource = result.rekam_medis.entities;
                                    })
                            }
                        }
                    })
            }
        });
    }

    handleTidakHadirAntrian(id_pendaftaran: string) {
        this.onUpdateStatusPasien(id_pendaftaran, 2);
        this.ShowModalPanggilPasien = false;
    }

    private onUpdateStatusPasien(id_pendaftaran: string, kode: number) {
        // this._rekamMedisService
        //     .updateStatus(id_pendaftaran, kode)
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.responseResult) {
        //             this.handleSearchAntrian(this.SelectedPoli, this.SelectedTanggal);
        //         }
        //     })
    }
}
