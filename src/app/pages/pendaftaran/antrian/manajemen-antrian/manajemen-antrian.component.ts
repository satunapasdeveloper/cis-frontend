import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { ManajemenAntrianModel } from 'src/app/model/pages/pendaftaran/manajemen-antrian.model';
import { LoketModel } from 'src/app/model/pages/pendaftaran/setup-loket.model';
import { ManajemenUserModel } from 'src/app/model/pages/setup-data/manajemen-user.model';
import { ManajemenAntrianService } from 'src/app/services/pendaftaran-klinik/antrian/manajemen-antrian.service';
import { SetupLoketService } from 'src/app/services/pendaftaran-klinik/antrian/setup-loket.service';

@Component({
    selector: 'app-manajemen-antrian',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        ButtonModule,
    ],
    templateUrl: './manajemen-antrian.component.html',
    styleUrl: './manajemen-antrian.component.scss'
})
export class ManajemenAntrianComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    LoketDatasource: LoketModel.ILoket[] = [];

    SelectedLoket = 0;

    AntrianDipanggil!: ManajemenAntrianModel.IPanggilAntrian;

    timeElapsed: number = 0;
    timer: any;
    isRunning: boolean = false;

    AntrianTerlewati: ManajemenAntrianModel.ISkipAntrian[] = [];

    constructor(
        private _setupLoketService: SetupLoketService,
        private _manajemenAntrianService: ManajemenAntrianService
    ) {
        this.AntrianDipanggil = {
            id_antrian: "1",
            no_antrian: 'A001',
            id_antrian_jenis: 1,
            jenis_antrian: 'UMUM',
            id_loket: 3,
            id_antrian_status: 1,
            status_antrian: 'MENUNGGU',
            id_pendaftaran: null,
            created_at: formatDate(new Date(), 'yyyy-MM-dd', 'EN'),
        }
    }

    ngOnInit(): void {
        // this.onPanggilAntrian();
        this.getAntrianTerlewati();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    onPanggilAntrian() {
        this._manajemenAntrianService
            .panggil(3)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.AntrianDipanggil = result.data;
                }
            })
    }

    onStartTimer(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval(() => {
                this.timeElapsed++;
            }, 1000);
        }
    }

    onStopTimer(): void {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
        }
    }

    onResetTimer(): void {
        this.onStopTimer();
        this.timeElapsed = 0;
    }

    formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
    }

    private padZero(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }

    private getAntrianTerlewati() {
        this._manajemenAntrianService
            .getAntrianTerlewati(3)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    console.log(result.data);
                    this.AntrianTerlewati = result.data;
                }
            })
    }
}
