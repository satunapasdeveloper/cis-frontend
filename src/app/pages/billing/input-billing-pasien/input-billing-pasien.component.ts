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
        InputNumberModule,
        DialogModule
    ],
    templateUrl: './input-billing-pasien.component.html',
    styleUrl: './input-billing-pasien.component.scss'
})
export class InputBillingPasienComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    @ViewChild('InformasiPasienComps') InformasiPasienComps!: InformasiPasienComponent;

    Billing: any;

    DetailBillingDatasource: any[] = [];

    SelectedDetailBilling: any[] = [];

    ShowModalBayar = false;

    PaymentMethodDatasource: any[] = [];

    tanggal_billing: Date = this._utilityService.onFormatDate(new Date(), 'DD-MM-yyyy HH:mm:ss');
    total_tagihan = 0;
    sudah_terbayar = 0;
    sisa_tagihan = 0;
    total_bayar = 0;

    detail_billing: any[] = [];

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
                    this.Billing = result.data;
                    this.InformasiPasienComps.getByIdRegister(result.data.id_register);
                    this.getDetailBilling(result.data.id_register, result.data.type == 'BPJS');
                }
            })
    }

    private getDetailBilling(id_register: any, is_bpjs: boolean) {
        this._billingService
            .getDetailBilling(id_register, is_bpjs)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                if (result.responseResult) {
                    this.DetailBillingDatasource = result.data;
                    this.sudah_terbayar = result.totals.sudah_terbayar;
                    this.sisa_tagihan = result.totals.sisa_tagihan;
                    this.total_tagihan = result.totals.sisa_tagihan + result.totals.sudah_terbayar;
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

    handleGridEditComplete(args: any, jenis_layanan: string) {
        let { data, field, newValue } = args;

        // Ensure values are treated as numbers and default to 0 if null/undefined
        const asuransi = Number(data.asuransi) || 0;
        const subsidi = Number(data.subsidi) || 0;
        const subtotal = Number(data.subtotal) || 0;

        // Recalculate iur (out-of-pocket cost)
        data.iur = subtotal - asuransi - subsidi;

        console.log("data =>", data);
    }

    handleOpenModalBayar() {
        this.detail_billing = this.SelectedDetailBilling.map((item: any) => {
            return {
                jenis_layanan: item.jenis_layanan,
                id_reff: item.id_reff,
                nama: item.nama,
                satuan: item.satuan,
                qty: item.qty,
                harga: item.harga,
                subtotal: item.subtotal,
                asuransi: item.asuransi,
                iur: item.iur,
                subsidi: item.subsidi,
            }
        });
        this.total_bayar = this.detail_billing.reduce((sum, item) => sum + (item.iur || 0), 0);

        const payload = {
            type: this.Billing.type,
            tanggal_billing: this.tanggal_billing,
            id_register: this.Billing.id_register,
            keterangan: `invoice_${this.Billing.register.pasien.no_register}`,
            detail_billing: this.detail_billing
        };

        this._billingService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.getById();
                    this.ShowModalBayar = true;
                }
            })

    }

    handlePayment() {
        const payload = {
            id_billing: this.Billing.id_billing,
            id_kasir_shift: this.Billing.id_kasir_shift,
            detail: this.PaymentMethodDatasource.map((item: any) => {
                return {
                    id_metode_pembayaran: item.id_metode_pembayaran,
                    nominal_bayar: item.nominal
                }
            }),
        };

        this._billingService
            .payment(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Billing Berhasil Disimpan' });

                    setTimeout(() => {
                        this.ShowModalBayar = false;
                        this.getById();
                    }, 1000);
                }
            })
    }
}
