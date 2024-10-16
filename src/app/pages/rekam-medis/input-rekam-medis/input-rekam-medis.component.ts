import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { Stepper, StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { AnamesisComponent } from './anamesis/anamesis.component'
import { PemeriksaanFisikComponent } from './pemeriksaan-fisik/pemeriksaan-fisik.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { TindakanComponent } from './tindakan/tindakan.component';
import { ResepComponent } from './resep/resep.component';
import { StatusComponent } from './status/status.component';
import { BillingComponent } from './billing/billing.component';
import { InformasiPasienComponent } from './informasi-pasien/informasi-pasien.component';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { DialogModule } from 'primeng/dialog';
import { RekamMedisActions, RekamMedisState } from 'src/app/store/rekam-medis';
import { Subject, takeUntil } from 'rxjs';
import { PaymentComponent } from './payment/payment.component';
import { HistoryPaymentComponent } from './history-payment/history-payment.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-input-rekam-medis',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        StepperModule,
        ButtonModule,
        AnamesisComponent,
        PemeriksaanFisikComponent,
        InformasiPasienComponent,
        DiagnosisComponent,
        TindakanComponent,
        ResepComponent,
        StatusComponent,
        BillingComponent,
        DialogModule,
        PaymentComponent,
        HistoryPaymentComponent,
        ConfirmDialogModule
    ],
    templateUrl: './input-rekam-medis.component.html',
    styleUrl: './input-rekam-medis.component.scss'
})
export class InputRekamMedisComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali Ke Daftar Rekam Medis',
            icon: 'pi pi-chevron-left'
        }
    ];

    SelectedPasien: any;

    @ViewChild('AnamesisComps') AnamesisComps!: AnamesisComponent;

    @ViewChild('PemeriksaanFisikComps') PemeriksaanFisikComps!: PemeriksaanFisikComponent;

    @ViewChild('DiagnosisComps') DiagnosisComps!: DiagnosisComponent;

    @ViewChild('TindakanComps') TindakanComps!: TindakanComponent;

    @ViewChild('ResepComps') ResepComps!: ResepComponent;

    @ViewChild('StatusComps') StatusComps!: StatusComponent;

    @ViewChild('BillingComps') BillingComps!: BillingComponent;

    @ViewChild('PaymentComps') PaymentComps!: PaymentComponent;

    @ViewChild('HistoryPaymentComps') HistoryPaymentComps!: HistoryPaymentComponent;

    constructor(
        private _store: Store,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _rekamMedisService: RekamMedisService,
        private _confirmationService: ConfirmationService,
    ) { }

    ngOnInit(): void {
        this.getById(this._activatedRoute.snapshot.queryParams['id']);
        this.getHistoryPembayaran(this._activatedRoute.snapshot.queryParams['id']);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getById(id_pendaftaran: string) {
        this._store
            .dispatch(new RekamMedisActions.GetByIdRekamMedis(id_pendaftaran))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.SelectedPasien = result.rekam_medis.single;
            });
    }

    private getHistoryPembayaran(id_pendaftaran: string) {
        this._store
            .dispatch(new RekamMedisActions.GetHistoryPayment(id_pendaftaran))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.SelectedPasien = result.rekam_medis.single
            });
    }

    handleBackToList() {
        this._router.navigateByUrl('rekam-medis/data');
    }

    handleCreateAnamesis(nextCallback: any) {
        let payload = this.AnamesisComps.FormComps.FormGroup.value;
        delete payload.is_ada_riwayat_alergi;
        delete payload.is_ada_riwayat_pengobatan;
        delete payload.is_ada_riwayat_penyakit_terdahulu;

        if (this.SelectedPasien.status_billing) {
            nextCallback.emit();
        } else {
            this._store
                .dispatch(new RekamMedisActions.CreateAnamesis(payload))
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.rekam_medis.success) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });

                        setTimeout(() => {
                            nextCallback.emit();
                        }, 500);
                    }
                });
        }
    }

    handleCreatePemeriksaanFisik(nextCallback: any) {
        let payload = {
            ...this.PemeriksaanFisikComps.FormComps.FormGroup.value,
            ...this.PemeriksaanFisikComps.FormKeadaanUmumComps.FormGroup.value,
            ...this.PemeriksaanFisikComps.FormVitalSignComps.FormGroup.value,
            kondisi_tubuh: this.PemeriksaanFisikComps.CatatanKondisiTubuh$.value
        };

        if (this.SelectedPasien.status_billing) {
            nextCallback.emit();
        } else {
            this._store
                .dispatch(new RekamMedisActions.CreatePemeriksaanFisik(payload))
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.rekam_medis.success) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });

                        setTimeout(() => {
                            nextCallback.emit();
                        }, 500);
                    }
                });
        }
    }

    handleCreateDiagnosa(nextCallback: any) {
        let payload = {
            diagnosisi: this.DiagnosisComps.DiagnosaDatasource
        };

        if (this.SelectedPasien.status_billing) {
            nextCallback.emit();
        } else {
            this._store
                .dispatch(new RekamMedisActions.CreateDiagnosa(payload))
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.rekam_medis.success) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });

                        setTimeout(() => {
                            nextCallback.emit();
                        }, 500);
                    }
                });
        }
    }

    handleCreateTindakan(nextCallback: any) {
        const payload: any = this.TindakanComps.getTindakanForRekamMedis();

        if (this.SelectedPasien.status_billing) {
            nextCallback.emit();
        } else {
            this._store
                .dispatch(new RekamMedisActions.CreateTindakan(payload))
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.rekam_medis.success) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });

                        setTimeout(() => {
                            nextCallback.emit();
                        }, 500);
                    }
                });
        }
    }

    handleCreateResep(nextCallback: any) {
        const payload = {
            id_pendaftaran: this.SelectedPasien.id_pendaftaran,
            obat: this.ResepComps.ResepNonRacikan.map((item) => {
                return {
                    id_item: item.id_item,
                    nama_obat: item.nama_obat,
                    qty: parseFloat(item.qty),
                    harga: parseFloat(item.harga),
                    subtotal: parseFloat(item.subtotal),
                    aturan_pakai: item.aturan_pakai,
                    waktu: item.waktu_pemberian_obat,
                    waktu_spesifik: item.waktu_spesifik_pemberian_obat,
                    rute_pemberian: item.rute_pemberian_obat,
                }
            }),
            racikan: this.ResepComps.ResepRacikan.map((item) => {
                return {
                    nama_obat: item.nama_racikan,
                    qty: 1,
                    aturan_pakai: item.aturan_pakai,
                    waktu: item.waktu_pemberian_obat,
                    waktu_spesifik: item.waktu_spesifik_pemberian_obat,
                    rute_pemberian: item.rute_pemberian_obat,
                    racikan: item.obats ? item.obats.map((obat: any) => {
                        return {
                            id_item: parseFloat(obat.id_item),
                            nama_obat: obat.nama_obat,
                            qty: parseFloat(obat.qty),
                            harga: parseFloat(obat.harga),
                            subtotal: parseFloat(obat.subtotal)
                        }
                    }) : []
                }
            }),
            manual: []
        };

        if (this.SelectedPasien.status_billing) {
            nextCallback.emit();
        } else {
            this._store
                .dispatch(new RekamMedisActions.CreateResep(payload))
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.rekam_medis.success) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });

                        setTimeout(() => {
                            nextCallback.emit();
                        }, 500);
                    }
                });
        }
    }

    handleCreateStatusPulang(nextCallback: any) {
        const payload = {
            id_pendaftaran: this.SelectedPasien.id_pendaftaran,
            status_pulang: this.StatusComps.SelectedStatus
        };

        if (this.SelectedPasien.status_billing) {
            nextCallback.emit();
        } else {
            this._store
                .dispatch(new RekamMedisActions.CreateStatusPulang(payload))
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.rekam_medis.success) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });

                        setTimeout(() => {
                            nextCallback.emit();
                        }, 500);
                    }
                });
        }
    }

    handleOpenDialogPayment() {
        let billing = this.BillingComps.Billing;
        billing.tanggal = formatDate(new Date(), 'dd-MM-yyyy', 'EN');

        this.PaymentComps.tagihan = billing;
        this.PaymentComps.ShowDialogPayment = true
    }

    handleCreateInvoice(args: any) {
        let data = JSON.parse(JSON.stringify(args));

        data.tanggal = formatDate(new Date(), 'yyyy-MM-dd', 'EN');
        delete data.bayar;
        delete data.kembalian;

        this._store
            .dispatch(new RekamMedisActions.CreateInvoice(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.rekam_medis.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });
                    this.PaymentComps.ShowDialogPayment = false;
                    this.selectDetailRekamMedisEntities();
                }
            });
    }

    private selectDetailRekamMedisEntities() {
        this._store
            .select(RekamMedisState.rekamMedisDetail)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.SelectedPasien = result;
            })
    }

    handleCancelInvoice(args: string) {
        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            message: 'Invoice yang telah terbayar akan dibatalkan',
            header: 'Apakah Anda Yakin?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Iya Saya Yakin',
            rejectIcon: "none",
            rejectLabel: 'Tidak, Kembali',
            accept: () => {
                this._store
                    .dispatch(new RekamMedisActions.CancelHistoryPayment(args))
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.rekam_medis.success) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Invoice Berhasil Dibatalkan' });
                            this.selectDetailRekamMedisEntities();
                        }
                    })
            }
        });
    }
}
