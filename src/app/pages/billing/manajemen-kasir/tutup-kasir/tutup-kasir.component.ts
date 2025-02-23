import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ɵNG_INJ_DEF } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { ManajemenKasirService } from 'src/app/services/billing/manajemen-kasir/manajemen-kasir.service';
import { SetupLoketKasirService } from 'src/app/services/billing/manajemen-kasir/setup-loket-kasir.service';
import { SetupMetodePembayaranService } from 'src/app/services/billing/setup-data/setup-metode-pembayaran.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-tutup-kasir',
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
    ],
    templateUrl: './tutup-kasir.component.html',
    styleUrl: './tutup-kasir.component.scss'
})
export class TutupKasirComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'save',
            title: 'Simpan',
            icon: 'pi pi-save'
        }
    ];

    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    PaymentMethodDatasource: any[] = [];

    Keterangan = "";

    constructor(
        private _utilityService: UtilityService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _manajemenKasirService: ManajemenKasirService,
        private _setupLoketKasirService: SetupLoketKasirService,
        private _setupMetodePembayaranService: SetupMetodePembayaranService,
    ) {
        this.FormProps = {
            id: 'form_tutup_kasir',
            fields: [
                {
                    id: 'id_kasir_shift',
                    label: 'Id Kasir Shift',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'tanggal_shift',
                    label: 'Tgl. Shift',
                    required: true,
                    type: 'text',
                    readonly: true,
                    value: '',
                },
                {
                    id: 'opened_at',
                    label: 'Tgl. Buka Kasir',
                    required: true,
                    type: 'text',
                    readonly: true,
                    value: '',
                },
                {
                    id: 'opening_balance',
                    label: 'Modal Kasir',
                    required: true,
                    type: 'text',
                    readonly: true,
                    value: '',
                },
                {
                    id: 'keterangan',
                    label: 'Keterangan Buka Kasir',
                    required: false,
                    type: 'text',
                    readonly: true,
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getDetailShiftKasir();
        this.getAllPaymentMethod();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDetailShiftKasir() {
        this._manajemenKasirService
            .getById(6)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    result.data = {
                        ...result.data,
                        tanggal_shift: this._utilityService.onFormatDate(new Date(result.data.tanggal_shift), 'DD-MM-yyyy'),
                        opened_at: this._utilityService.onFormatDate(new Date(result.data.opened_at), 'DD-MM-yyyy HH:mm'),
                        opening_balance: formatCurrency(result.data.opening_balance, 'EN', 'Rp. ')
                    }

                    this.FormComps.FormGroup.patchValue(result.data);
                }
            });
    }

    private getAllPaymentMethod() {
        this._setupMetodePembayaranService
            .getAllActive({ page: 1, count: 100 })
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
            });
    }

    handleSaveTutupKasir() {
        const value = this.FormComps.FormGroup.value;

        const payload = {
            id_kasir_shift: value.id_kasir_shift,
            keterangan: this.Keterangan,
            detail_rekap: this.PaymentMethodDatasource.map((item: any) => {
                return {
                    id_metode_pembayaran: item.id_metode_pembayaran,
                    nominal: item.nominal
                }
            })
        }

        this._manajemenKasirService
            .updateTutupKasir(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.getDetailShiftKasir();
                }
            })
    }
}
