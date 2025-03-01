import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { ManajemenKasirService } from 'src/app/services/billing/manajemen-kasir/manajemen-kasir.service';
import { SetupLoketKasirService } from 'src/app/services/billing/manajemen-kasir/setup-loket-kasir.service';

@Component({
    selector: 'app-croscek-tutup-kasir',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputNumberModule,
        InputTextareaModule,
    ],
    templateUrl: './croscek-tutup-kasir.component.html',
    styleUrl: './croscek-tutup-kasir.component.scss'
})
export class CroscekTutupKasirComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form_buka_kasir' | 'form_update_modal' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Tambah',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'SetupMetodePembayaran',
        column: [
            { field: 'nama_kasir', headerName: 'Nama Kasir' },
            { field: 'tanggal_shift', headerName: 'Tgl. Shift' },
            { field: 'opened_at', headerName: 'Tgl. Buka Kasir', format: 'datetime' },
            { field: 'opening_balance', headerName: 'Modal Kasir', format: 'currency' },
            { field: 'closing_balance', headerName: 'Pendapatan Versi Kasir', format: 'currency' },
            { field: 'grand_total_system', headerName: 'Pendapatan Versi Sistem', format: 'currency' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Detail'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'tanggal_shift',
                placeholder: 'Cari Tgl. Shift Disini',
                type: 'date'
            }
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Metode Pembayaran Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    DetailTutupKasir: any[] = [];

    ShowDialogDetail = false;

    IdKasirShift = 0;
    Keterangan = "";

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _manajemenKasirService: ManajemenKasirService,
        private _setupLoketKasirService: SetupLoketKasirService,
    ) { }

    ngOnInit(): void {
        this.getAll({ page: 1, count: 5 });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        this._manajemenKasirService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                }
            });
    }

    private getCompare(id_kasir_shift: number) {
        this._manajemenKasirService
            .getComparePayment(id_kasir_shift)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.IdKasirShift = id_kasir_shift;
                    this.DetailTutupKasir = result.data;
                    this.ShowDialogDetail = true;
                }
            });
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'detail') {
            this.getCompare(args.data.id_kasir_shift);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    handleValidasi() {
        const data = {
            id_kasir_shift: this.IdKasirShift,
            keterangan_approved: this.Keterangan,
            detail_compare: this.DetailTutupKasir
        };

        this._manajemenKasirService
            .croscekKasir(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.ShowDialogDetail = false;
                    this.IdKasirShift = 0;
                    this.Keterangan = "";
                    this.DetailTutupKasir = [];
                    this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
                }
            })
    }

}
