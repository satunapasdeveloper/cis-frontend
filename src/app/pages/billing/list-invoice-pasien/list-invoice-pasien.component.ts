import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupLoketKasirService } from 'src/app/services/billing/manajemen-kasir/setup-loket-kasir.service';
import { BillingService } from 'src/app/services/billing/tagihan/billing.service';

@Component({
    selector: 'app-list-invoice-pasien',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './list-invoice-pasien.component.html',
    styleUrl: './list-invoice-pasien.component.scss'
})
export class ListInvoicePasienComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Bayar Tagihan',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'SetupMetodePembayaran',
        column: [
            { field: 'no_register', headerName: 'No. Register', class: 'text-blue-500 font-semibold' },
            { field: 'tanggal_billing', headerName: 'Tgl. Register', format: 'date' },
            { field: 'nama_pasien', headerName: 'Nama Pasien' },
            { field: 'type', headerName: 'Debitur' },
            { field: 'total_billing', headerName: 'Total Tagihan' },
            { field: 'status_billing', headerName: 'Status' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Bayar Tagihan'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'nama_pasien',
                placeholder: 'Cari Nama Pasien Disini',
                type: 'text'
            },
            {
                id: 'no_rekam_medis',
                placeholder: 'Cari No. Rekam Medis Disini',
                type: 'text'
            },
            {
                id: 'no_register',
                placeholder: 'Cari No. Register Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. MetodePembayaran Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    constructor(
        private _router: Router,
        private _billingService: BillingService,
    ) { }

    ngOnInit(): void {
        this.getAll({ page: 1, count: 5 });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        this._billingService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                }
            });
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'bayar tagihan') {
            this._router.navigateByUrl(`/billing/payment-invoice?id=${args.data.id_billing}`)
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
}
