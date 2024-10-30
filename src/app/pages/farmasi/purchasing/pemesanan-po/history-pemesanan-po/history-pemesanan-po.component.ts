import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PurchasingOrderActions } from 'src/app/store/farmasi/purchasing-order/pemesanan-po';
import { SetupPoliState } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-history-pemesanan-po',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
    ],
    templateUrl: './history-pemesanan-po.component.html',
    styleUrl: './history-pemesanan-po.component.scss'
})
export class HistoryPemesananPoComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Tambah',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'HistoryPemesananPo',
        column: [
            { field: 'no_pemesanan', headerName: 'No. Pemesanan', width: '200px' },
            { field: 'tgl_pemesanan', headerName: 'Tgl. Pemesanan', format: 'date', width: '200px' },
            { field: 'tgl_expired', headerName: 'Tgl. Expired', format: 'date', width: '200px' },
            { field: 'nama_stockroom', headerName: 'Stockroom', width: '200px' },
            { field: 'nama_supplier', headerName: 'Supplier', width: '300px' },
            { field: 'jumlah_item', headerName: 'Jumlah Item', format: 'number', width: '200px' },
            { field: 'total_harga', headerName: 'Total Harga', format: 'currency', width: '200px' },
            { field: 'created_at', headerName: 'Waktu Input', format: 'currency', width: '200px' },
            { field: 'created_by', headerName: 'User Input', width: '200px' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'no_pemesanan',
        searchPlaceholder: 'Cari No. Pemesanan Disini'
    };

    GridSelectedData: any;


    constructor(
        private _store: Store,
        private _router: Router,
    ) { }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .dispatch(new PurchasingOrderActions.GetAllPurchasingOrder({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this._router.navigateByUrl('/farmasi/purchasing/pemesanan-po/input');
        };
    }


}
