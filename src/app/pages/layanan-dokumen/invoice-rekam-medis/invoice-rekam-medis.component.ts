import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { FormPilihPasienForDokumenComponent } from 'src/app/components/form/form-pilih-pasien-for-dokumen/form-pilih-pasien-for-dokumen.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { RekamMedisModel } from 'src/app/model/pages/rekam-medis/rekam-medis.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { RekamMedisActions } from 'src/app/store/rekam-medis';
import { HeaderLayananDokumenComponent } from '../header-layanan-dokumen/header-layanan-dokumen.component';

@Component({
    selector: 'app-invoice-rekam-medis',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DashboardComponent,
        HeaderLayananDokumenComponent,
        FormPilihPasienForDokumenComponent,
    ],
    templateUrl: './invoice-rekam-medis.component.html',
    styleUrl: './invoice-rekam-medis.component.scss'
})
export class InvoiceRekamMedisComponent implements OnInit, AfterViewInit, OnDestroy {

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

    SelectedRekamMedis!: RekamMedisModel.IRekamMedis;

    ShowRiwayatRekamMedis = false;

    FormValue = new BehaviorSubject<any>(null);

    Billing: any;

    Invoice: any;

    constructor(
        private _store: Store,
        private _utilityService: UtilityService,
        private _rekamMedisService: RekamMedisService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(args: any) {
        if (args.id == 'cetak') {
            const el = document.getElementById('invoice') as HTMLElement;

            if (el) {
                this._utilityService
                    .exportToPdf(
                        'invoice',
                        `Invoice - ${this.SelectedRekamMedis.nama_lengkap} - ${this.SelectedRekamMedis.no_rekam_medis}`
                    )
            }
        }
    }

    handleChooseRiwayatKunjungan(args: any) {
        this.SelectedRekamMedis = args;

        this._store
            .dispatch(new RekamMedisActions.GetResumeMedis(args.id_pendaftaran))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.rekam_medis.success) {
                    this.ShowRiwayatRekamMedis = true;
                    this.getHistoryPayment(args.id_pendaftaran);
                    this.getTagihan(args.id_pendaftaran);
                }
            });
    }

    private getHistoryPayment(id_pendaftaran: string) {
        this._rekamMedisService
            .getAllHistoryPembayaran(id_pendaftaran)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.Invoice = result.data ? result.data[0] : null;
            })
    }


    private getTagihan(id_pendaftaran: string) {
        this._rekamMedisService
            .getTagihan(id_pendaftaran)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.Billing = result.data;
                }
            })
    }

    formatDate(date: string): string {
        return formatDate(new Date(date), 'dd-MM-yyyy', 'EN');
    }

}
