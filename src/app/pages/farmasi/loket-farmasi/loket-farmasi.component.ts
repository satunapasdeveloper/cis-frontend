import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { SearchPasienDialogComponent } from 'src/app/components/dialog/search-pasien-dialog/search-pasien-dialog.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { ResepService } from 'src/app/services/pelayanan-klinik/rekam-medis/resep.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-loket-farmasi',
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
    templateUrl: './loket-farmasi.component.html',
    styleUrl: './loket-farmasi.component.scss'
})
export class LoketFarmasiComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    AntrianDatasource: any[] = [];

    AntrianQueryParams: any;

    TanggalStartFilterSearch: any;
    TanggalEndFilterSearch: any;

    SelectedPasien: any;
    ShowModalPanggilPasien: boolean = false;
    @ViewChild('SearchPasienDialogComps') SearchPasienDialogComps!: SearchPasienDialogComponent;

    constructor(
        private _store: Store,
        private _router: Router,
        private _resepService: ResepService,
    ) { }

    ngOnInit(): void {
        const filter = localStorage.getItem("_ANTRIAN_FARMASI_FILTER_SEARCH_") ? JSON.parse(localStorage.getItem("_ANTRIAN_FARMASI_FILTER_SEARCH_") as any) : null;

        if (filter) {
            this.handleSearchAntrian(filter.start_date, filter.end_date);
        };
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }


    handleSearchAntrian(start_date: string, end_date: string) {
        this.AntrianQueryParams = {
            page: 1,
            count: 100,
            start_date: formatDate(new Date(start_date), 'yyyy-MM-dd', 'EN'),
            end_date: formatDate(new Date(end_date), 'yyyy-MM-dd', 'EN'),
        };

        if (start_date) {
            this.TanggalStartFilterSearch = new Date(start_date);
        };

        if (end_date) {
            this.TanggalEndFilterSearch = new Date(end_date);
        };

        this._resepService
            .getResep("68")
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                localStorage.setItem('_ANTRIAN_FARMASI_FILTER_SEARCH_', JSON.stringify(this.AntrianQueryParams));
                this.AntrianDatasource = result.responseResult ? result.data : [];
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
        console.log("data =>", data);
        this.SelectedPasien = data;
        this.ShowModalPanggilPasien = true;

        !environment.production && console.log("panggil data pasien =>", data);
    }

    handleGoToTelaah(args: any) {
        localStorage.setItem('_SAFSH_', JSON.stringify(args));
        setTimeout(() => {
            this._router.navigateByUrl(`/farmasi/telaah-resep?id_register=${args.id_register}&id_resep=${args.id_resep}`)
        }, 500);
    }

    handleGoToPenyerahan(args: any) {
        localStorage.setItem('_SAFSH_', JSON.stringify(args));
        setTimeout(() => {
            this._router.navigateByUrl(`/farmasi/penyerahan-resep?id_register=${args.id_register}&id_resep=${args.id_resep}`)
        }, 500);
    }

    private onCallAntrian(data: any) {
        const voice: any = speechSynthesis.getVoices();
        const msg = new window.SpeechSynthesisUtterance();

        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1;
        msg.lang = "id-ID";
        msg.voice = voice.find((item: any) => { return item.name == 'Google Bahasa Indonesia' });

        msg.text = `Panggilan....Kepada....Nomor....antrian....${data.no_antrian},....pasien....${data.nama_pasien},....menuju....tempat...pengambilan...resep`;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    }

    handlePanggilAntrian(data: any) {
        //     this._antrianPoliklinikRawatJalanService
        //         .panggil(id_register)
        //         .pipe(takeUntil(this.Destroy$))
        //         .subscribe((result) => {
        //             if (result.responseResult) {
        this.onCallAntrian(this.SelectedPasien);
        // this.handleSearchAntrian(this.AntrianQueryParams.tanggal_admisi, this.AntrianQueryParams.id_poli, this.AntrianQueryParams.id_dokter, this.AntrianQueryParams.nama_pasien);
        //     }
        // })
    }

}
