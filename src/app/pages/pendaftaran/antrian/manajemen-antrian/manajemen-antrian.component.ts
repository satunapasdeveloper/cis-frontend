import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { ManajemenAntrianModel } from 'src/app/model/pages/pendaftaran/manajemen-antrian.model';
import { LoketModel } from 'src/app/model/pages/pendaftaran/setup-loket.model';
import { ManajemenAntrianService } from 'src/app/services/pendaftaran-klinik/antrian/manajemen-antrian.service';
import { SetupLoketService } from 'src/app/services/pendaftaran-klinik/antrian/setup-loket.service';

@Component({
    selector: 'app-manajemen-antrian',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        ButtonModule,
        DialogModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './manajemen-antrian.component.html',
    styleUrl: './manajemen-antrian.component.scss'
})
export class ManajemenAntrianComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    ShowDialogPilihLoket: boolean = false;

    LoketDatasource: LoketModel.ILoket[] = [];

    SelectedLoket: any;

    AntrianDipanggil!: ManajemenAntrianModel.IPanggilAntrian;

    timeElapsed: number = 0;
    timer: any;
    isRunning: boolean = false;

    AntrianTerlewati: ManajemenAntrianModel.ISkipAntrian[] = [];

    constructor(
        private _setupLoketService: SetupLoketService,
        private _manajemenAntrianService: ManajemenAntrianService
    ) { }

    ngOnInit(): void {
        this.onShowDialogPilihLoket();
    }

    ngOnDestroy(): void {
        localStorage.removeItem("_SN_HIS_LOKET_");
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(args: any) {
        if (args.id == 'change_loket') {
            this.ShowDialogPilihLoket = true;
            this.getAllLoket();
        }
    }

    private getAllLoket() {
        this._setupLoketService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.LoketDatasource = result.data.rows;
                }
            })
    }

    private onShowDialogPilihLoket() {
        const selectedLoket = localStorage.getItem("_SN_HIS_LOKET_") as any;

        if (JSON.parse(selectedLoket)) {
            console.log("selected loket => ", selectedLoket);
            this.SelectedLoket = JSON.parse(selectedLoket);
            this.ButtonNavigation = [
                {
                    id: 'change_loket',
                    title: 'Ubah Loket',
                    icon: 'pi pi-sync'
                }
            ];

            this.getAntrianTerlewati();

        } else {
            this.ShowDialogPilihLoket = true;
            this.getAllLoket();
        }
    }

    handlePilihLoket(args: any) {
        localStorage.setItem("_SN_HIS_LOKET_", JSON.stringify(args));
        this.ShowDialogPilihLoket = false;
        this.getAntrianTerlewati();
        this.AntrianDipanggil = null as any;
    }

    handlePanggilAntrian() {
        this._manajemenAntrianService
            .panggil(this.SelectedLoket.id_loket)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.AntrianDipanggil = result.data;
                }
            })
    }

    private onStartTimer(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval(() => {
                this.timeElapsed++;
            }, 1000);
        }
    }

    private onStopTimer(): void {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
        }
    }

    private onResetTimer(): void {
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

    handlePanggilUlang() {
        this._manajemenAntrianService
            .panggilUlang(this.AntrianDipanggil.id_antrian as any)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    console.log("panggil ulang ...");
                }
            })
    }

    handleStartAdmisi() {
        this._manajemenAntrianService
            .startAdmisi(this.AntrianDipanggil.id_antrian as any)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.onStartTimer();
                }
            })
    }

    handleStopAdmisi() {
        this._manajemenAntrianService
            .stopAdmisi(this.AntrianDipanggil.id_antrian as any)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.onStopTimer();
                    this.onResetTimer();
                    this.getAntrianTerlewati();
                    this.AntrianDipanggil = null as any
                }
            })
    }

    private getAntrianTerlewati() {
        this._manajemenAntrianService
            .getAntrianTerlewati(this.SelectedLoket.id_loket)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.AntrianTerlewati = result.data;
                }
            })
    }

    handleClickAntrianTerlewati(args: any) {
        this._manajemenAntrianService
            .panggilUlang(args.id_antrian as any)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    console.log("panggil ulang antrian terlewati ...");
                    this.AntrianDipanggil = result.data;
                }
            })
    }
}
