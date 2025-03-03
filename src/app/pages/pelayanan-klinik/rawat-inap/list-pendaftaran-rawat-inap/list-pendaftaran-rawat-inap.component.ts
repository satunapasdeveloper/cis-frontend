import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil, map } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranRawatJalanModel } from 'src/app/model/pages/pelayanan/rawat-jalan/pendaftara-rawat-jalan.model';
import { PendaftaranRawatInapService } from 'src/app/services/pelayanan-klinik/rawat-inap/pendaftaran-rawat-inap.service';
import { PendaftaranRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/pendaftaran-rawat-jalan.service';
import { SetupNakesActions } from 'src/app/store/setup-data/nakes';
import { SetupPoliActions } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-list-pendaftaran-rawat-inap',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DashboardComponent,
        TableModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        InputTextModule,
        OverlayPanelModule,
        GridComponent
    ],
    templateUrl: './list-pendaftaran-rawat-inap.component.html',
    styleUrl: './list-pendaftaran-rawat-inap.component.scss'
})
export class ListPendaftaranRawatInapComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Buat Pendaftaran Rawat Inap',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'ListPendaftaranRawatJalan',
        column: [
            { field: 'no_antrian', headerName: 'No. Antrian', class: 'text-blue-500 font-semibold' },
            { field: 'no_register', headerName: 'No. Register', },
            { field: 'no_rekam_medis', headerName: 'No. Rekam Medis', },
            { field: 'nama_pasien', headerName: 'Nama Pasien', },
            { field: 'gender', headerName: 'Gender', },
            { field: 'tanggal_lahir', headerName: 'Tgl. Lahir', },
            { field: 'no_telf', headerName: 'No. Telepon', },
            { field: 'nama_penjamin', headerName: 'Penjamin', },
            { field: 'status_register', headerName: 'Status Penjamin' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Cetak SEP', 'Verifikasi Penjamin', 'Batal Pendaftaran', 'Bed Transfer', 'Permintaan Operasi'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'tanggal_admisi',
                placeholder: 'Cari Tgl. Visit Disini',
                type: 'date'
            },
            {
                id: 'nama_poli',
                placeholder: 'Cari Poli Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionValue: 'nama_poli',
                    optionName: 'nama_poli'
                }
            },
            {
                id: 'nama',
                placeholder: 'Cari Dokter Disini',
                type: 'dropdown',
                dropdownProps: {
                    options: [],
                    optionValue: 'nama',
                    optionName: 'nama'
                }
            },
            {
                id: 'nama_pasien',
                placeholder: 'Cari Nama Pasien Disini',
                type: 'text',
            },
        ],
        showSort: false,
        searchKeyword: 'loket',
        searchPlaceholder: 'Cari Nama Loket Disini',
        totalRows: 0

    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    constructor(
        private _store: Store,
        private _router: Router,
        private _pendaftaranRawatInapService: PendaftaranRawatInapService,
    ) { }

    ngOnInit(): void {
        this.handleSearchPendaftaran({ page: 1, count: 5 });
        this.getAllPoli();
        this.getAllDokter();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this._router.navigateByUrl('pelayanan-klinik/rawat-inap/pendaftaran')
        };
    }

    private getAllPoli() {
        this._store
            .dispatch(new SetupPoliActions.GetAllActivePoli({ page: 1, count: 100 }))
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return result.setup_poli.actives;
                })
            )
            .subscribe((result) => {
                const index = this.GridProps.customSearchProps?.findIndex(item => item.id == 'nama_poli')!;
                this.GridProps.customSearchProps![index].dropdownProps!.options = result;
            })
    }

    private getAllDokter() {
        this._store
            .dispatch(new SetupNakesActions.GetAllActiveNakes({ page: 1, count: 100 }))
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return result.setup_nakes.actives
                        .filter((item: any) => {
                            return item.nama_role.toLowerCase().includes('dokter')
                        });
                })
            )
            .subscribe((result) => {
                const index = this.GridProps.customSearchProps?.findIndex(item => item.id == 'nama')!;
                this.GridProps.customSearchProps![index].dropdownProps!.options = result;
            })
    }

    handleSearchPendaftaran(query: PendaftaranRawatJalanModel.IListPendaftaranQueryParams) {
        if (query.tanggal_admisi) {
            query.tanggal_admisi = formatDate(query.tanggal_admisi, 'yyyy-MM-dd', 'EN');
        }

        this._pendaftaranRawatInapService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.GridProps.dataSource = result.data.rows;
                this.GridProps.totalRows = result.data.totalRows;
            })
    }

    onToolbarClicked(args: any): void {
        console.log(args);

        if (args.type == 'bed transfer') {
            localStorage.setItem("_SPSH_", JSON.stringify(args.data));
            setTimeout(() => {
                this._router.navigateByUrl('/pelayanan-klinik/rawat-inap/transfer-tempat-tidur?state=create')
            }, 1000);
        }

        if (args.type == 'permintaan_operasi') {
            localStorage.setItem("_SPSH_", JSON.stringify(args.data));
            setTimeout(() => {
                this._router.navigateByUrl('/pelayanan-klinik/rawat-inap/permintaan_operasi?state=create')
            }, 1000);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this.handleSearchPendaftaran({ ...this.GridPaginationData, ...this.GridCustomSearchParams })
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this.handleSearchPendaftaran({ ...this.GridPaginationData, ...this.GridCustomSearchParams })
    }

}
