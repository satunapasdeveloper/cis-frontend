import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { AntrianResepBaruService } from 'src/app/services/farmasi/antrian/antrian-resep-baru.service';
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
        ConfirmDialogModule,
        InputTextModule,
        DynamicFormComponent,
    ],
    templateUrl: './loket-farmasi.component.html',
    styleUrl: './loket-farmasi.component.scss'
})
export class LoketFarmasiComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    AntrianDatasource: any[] = [];

    AntrianQueryParams: any;

    TanggalFilterSearch: any;
    StokroomFilterSearch: any;

    SelectedPasien: any;
    ShowModalPanggilPasien: boolean = false;

    ShodModalPengiriman: boolean = false;

    constructor(
        private _store: Store,
        private _router: Router,
        private _resepService: ResepService,
        private _activatedRoute: ActivatedRoute,
        private _antrianResepBaruService: AntrianResepBaruService,
    ) { }

    ngOnInit(): void {
        const filter = localStorage.getItem("_ANTRIAN_FARMASI_LOKET_FILTER_SEARCH_") ? JSON.parse(localStorage.getItem("_ANTRIAN_FARMASI_LOKET_FILTER_SEARCH_") as any) : null;

        if (filter) {
            this.handleSearchAntrian(filter.tanggal_resep, filter.id_stokroom);
        };
    }

    ngOnDestroy(): void {
        localStorage.removeItem("_ANTRIAN_FARMASI_LOKET_FILTER_SEARCH_");
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleSearchAntrian(tanggal_resep: string, id_stokroom: number) {
        this.AntrianQueryParams = {
            page: 1,
            count: 100,
            tanggal_resep: formatDate(new Date(tanggal_resep), 'yyyy-MM-dd', 'EN'),
        };

        if (tanggal_resep) {
            this.TanggalFilterSearch = new Date(tanggal_resep);
        };

        if (id_stokroom) {
            this.AntrianQueryParams.id_stokroom = id_stokroom
            this.StokroomFilterSearch = id_stokroom;
        };

        this._antrianResepBaruService
            .getAllForLoket(this.AntrianQueryParams)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                localStorage.setItem('_ANTRIAN_FARMASI_LOKET_FILTER_SEARCH_', JSON.stringify(this.AntrianQueryParams));
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

    handleFormatStatusResep(status: string) {
        return status ? status
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())
            : '-'
    }

    handleOpenDialogPanggil(data: any) {
        this.SelectedPasien = data;
        this.ShowModalPanggilPasien = true;
        !environment.production && console.log("panggil data pasien =>", data);
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

        msg.text = `Panggilan....Kepada....Nomor....antrian....${data.register.no_antrian_farmasi},....pasien....${data.register.pasien.nama_pasien},....menuju....tempat...pengambilan...obat`;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    }

    handlePanggilAntrian(data: any) {
        this._antrianResepBaruService
            .panggil(data.id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.onCallAntrian(this.SelectedPasien);
                    this.handleSearchAntrian(this.TanggalFilterSearch, this.StokroomFilterSearch);
                }
            })
    }


}
