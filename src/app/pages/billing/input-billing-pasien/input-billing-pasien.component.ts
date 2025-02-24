import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';
import { SetupLoketKasirService } from 'src/app/services/billing/manajemen-kasir/setup-loket-kasir.service';
import { SetupMetodePembayaranService } from 'src/app/services/billing/setup-data/setup-metode-pembayaran.service';
import { BillingService } from 'src/app/services/billing/tagihan/billing.service';
import { PendaftaranRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/pendaftaran-rawat-jalan.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-input-billing-pasien',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        InputNumberModule,
        InformasiPasienComponent,
        TableModule,
        InputTextModule,
        DialogModule
    ],
    templateUrl: './input-billing-pasien.component.html',
    styleUrl: './input-billing-pasien.component.scss'
})
export class InputBillingPasienComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    @ViewChild('InformasiPasienComps') InformasiPasienComps!: InformasiPasienComponent;

    DetailBillingDatasource: any[] = [];

    SelectedDetailBilling: any[] = [];

    ShowModalBayar = false;

    PaymentMethodDatasource: any[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _utilityService: UtilityService,
        private _messageService: MessageService,
        private _billingService: BillingService,
        private _confirmationService: ConfirmationService,
        private _setupLoketKasirService: SetupLoketKasirService,
        private _pendaftaranRawatJalanService: PendaftaranRawatJalanService,
        private _setupMetodePembayaranService: SetupMetodePembayaranService,
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.getById();
            this.getPaymentMethod();
        }, 1000);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getById() {
        const id = this._activatedRoute.snapshot.queryParams['id'];

        this._billingService
            .getById(id)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.InformasiPasienComps.getByIdRegister(result.data.id_register);
                    this.getDetailBilling(result.data.id_register);
                }
            })
    }

    private getDetailBilling(id_register: any) {
        this._billingService
            .getDetailBilling(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.DetailBillingDatasource = result.data;
                }
            })
    }

    private getPaymentMethod() {
        this._setupMetodePembayaranService
            .getAllActive({ page: 1, count: 10, sorts: 'id_metode_pembayaran' })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.PaymentMethodDatasource = result.data.rows.map((item: any) => {
                        return {
                            ...item,
                            nominal: 0
                        }
                    })
                }
            })
    }
}
