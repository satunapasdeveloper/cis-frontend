import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule, Calendar } from 'primeng/calendar';
import { Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LaporanService } from 'src/app/services/laporan/laporan.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { HeaderLaporanComponent } from '../header-laporan/header-laporan.component';

@Component({
    selector: 'app-laporan-pemakaian-obat-dan-bmhp',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        GridComponent,
        CalendarModule,
        DashboardComponent,
        HeaderLaporanComponent,
    ],
    templateUrl: './laporan-pemakaian-obat-dan-bmhp.component.html',
    styleUrl: './laporan-pemakaian-obat-dan-bmhp.component.scss'
})
export class LaporanPemakaianObatDanBmhpComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    UserData$ = this._authenticationService
        .UserData$
        .pipe(takeUntil(this.Destroy$));

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'export',
            title: `Export`,
            icon: 'pi pi-file-excel'
        },
        {
            id: 'cetak',
            title: `Cetak`,
            icon: 'pi pi-print'
        }
    ];

    Periode: string = "";

    @ViewChild('GridComps') GridComps!: GridComponent;

    GridProps: GridModel.IGrid = {
        id: 'laporan_pemakaian_obat',
        column: [
            { field: 'kode_kfa', headerName: 'Kode KFA', },
            { field: 'nama_item', headerName: 'Nama Item', },
            { field: 'satuan', headerName: 'Satuan', },
            { field: 'sum', headerName: 'Jumlah', format: 'number', class: 'text-end' },
        ],
        dataSource: [],
        height: "auto",
        showPaging: false,
        showSearch: false,
        showSort: false,
    };

    @ViewChild('CalendarSearchComps') CalendarSearchComps!: Calendar;

    constructor(
        private _messageService: MessageService,
        private _laporanService: LaporanService,
        private _utilityService: UtilityService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(args: any) {
        if (this.Periode) {
            if (args.id == 'cetak') {
                const el = document.getElementById('laporan_pemakaian_obat') as HTMLElement;

                if (el) {
                    this._utilityService
                        .exportToPdf(
                            'laporan_pemakaian_obat',
                            `Laporan Pemakaian Obat & BMHP`
                        );
                }
            };

            if (args.id == 'export') {
                this.GridComps.onExportExcel();
            };
        } else {
            this._messageService.clear();
            this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Mohon lakukan generate laporan' });
        }


    }

    handleSearch(search: Date[]) {
        if (search.length == 2) {
            const
                startDate = this._utilityService.onFormatDate(search[0], 'DD/MM/yyyy'),
                endDate = this._utilityService.onFormatDate(search[1], 'DD/MM/yyyy'),
                startDateParams = this._utilityService.onFormatDate(search[0], 'yyyy-MM-DD'),
                endDateParams = this._utilityService.onFormatDate(search[1], 'yyyy-MM-DD');

            this.Periode = `${startDate} s.d ${endDate}`;

            this._laporanService
                .getLaporanPemakaianObatdanBMHP(startDateParams, endDateParams)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.GridProps.dataSource = result.data;
                })

        }
    }
}
