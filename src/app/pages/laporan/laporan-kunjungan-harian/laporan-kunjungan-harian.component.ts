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
    selector: 'app-laporan-kunjungan-harian',
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
    templateUrl: './laporan-kunjungan-harian.component.html',
    styleUrl: './laporan-kunjungan-harian.component.scss'
})
export class LaporanKunjunganHarianComponent implements OnInit, OnDestroy {

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
        id: 'laporan_kunjungan_harian',
        column: [
            { field: 'tanggal_visit', headerName: 'Tanggal', format: 'date' },
            { field: 'kunjungan', headerName: 'Jumlah Kunjungan', format: 'number', class: 'text-center' },
            { field: 'laki', headerName: 'Pasien Pria', format: 'number', class: 'text-center' },
            { field: 'perempuan', headerName: 'Pasien Wanita', format: 'number', class: 'text-center' },
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
                const el = document.getElementById('laporan_kunjungan_harian') as HTMLElement;

                if (el) {
                    this._utilityService
                        .exportToPdf(
                            'laporan_kunjungan_harian',
                            `Laporan Kunjungan Harian`
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
                .getLaporanKunjunganHarian(startDateParams, endDateParams)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.GridProps.dataSource = result.data;
                })

        }
    }

}
