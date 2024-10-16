import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { BillingModel } from 'src/app/model/pages/rekam-medis/billing.model';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-history-payment',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule
    ],
    templateUrl: './history-payment.component.html',
    styleUrl: './history-payment.component.scss'
})
export class HistoryPaymentComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    Billing: any;

    Invoice!: BillingModel.IHistoryPembayaran;

    @Output('onCancel') onCancel = new EventEmitter<any>();

    constructor(
        private _store: Store,
        private _activatedRoute: ActivatedRoute,
        private _rekamMedisService: RekamMedisService,
    ) { }

    ngOnInit(): void {
        this.getHistoryPayment();
        this.getTagihan(this._activatedRoute.snapshot.queryParams['id']);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    getHistoryPayment() {
        this._store
            .select(RekamMedisState.rekamMedisHistoryPayment)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.Invoice = result as BillingModel.IHistoryPembayaran;
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

    cancelInvoice() {
        this.onCancel.emit(this._activatedRoute.snapshot.queryParams['id']);
    }

    downloadInvoice() {
        let data = document.getElementById('invoice') as any;  //Id of the table
        html2canvas(data).then(canvas => {
            // Few necessary setting options  
            let imgWidth = 208;
            let pageHeight = 295;
            let imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png')
            let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
            let position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
            pdf.save(`Invoice ${this.Invoice.nama_lengkap} ${this.Invoice.no_invoice}.pdf`); // Generated PDF   
        });
    }
}
