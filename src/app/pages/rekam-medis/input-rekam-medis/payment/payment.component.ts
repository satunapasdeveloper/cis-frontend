import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
    ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit, OnDestroy {

    ShowDialogPayment: boolean = false;

    tagihan: any = {
        tanggal: formatDate(new Date(), 'dd-MM-yyyy', 'EN'),
        subtotal: 0,
        diskon: 0,
        total: 0,
        bayar: 0,
        kembalian: 0,
        payment_method: 'Cash'
    };

    PaymentMethodDatasource: any[] = [
        { label: 'Tunai', value: 'Cash' },
        { label: 'Transfer', value: 'Transfer' },
        { label: 'QRIS', value: 'QRIS' },
    ];

    @Output('onSave') onSave = new EventEmitter<any>();

    constructor(
        private _rekamMedisService: RekamMedisService,
    ) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    handleChangeJumlahBayar(args: any) {
        if (this.tagihan.total <= args) {
            this.tagihan.kembalian = args - this.tagihan.total;
        }
    }

    handleSave() {
        this.onSave.emit(this.tagihan);
    }
}
