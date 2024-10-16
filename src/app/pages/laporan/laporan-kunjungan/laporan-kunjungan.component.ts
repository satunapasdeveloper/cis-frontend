import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule, Calendar } from 'primeng/calendar';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LaporanService } from 'src/app/services/laporan/laporan.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { HeaderLaporanComponent } from '../header-laporan/header-laporan.component';
import { DropdownModule } from 'primeng/dropdown';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';

@Component({
    selector: 'app-laporan-kunjungan',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        GridComponent,
        CalendarModule,
        DropdownModule,
        DashboardComponent,
        HeaderLaporanComponent,
    ],
    templateUrl: './laporan-kunjungan.component.html',
    styleUrl: './laporan-kunjungan.component.scss'
})
export class LaporanKunjunganComponent implements OnInit, OnDestroy {

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

    Diagnosa: string = "";

    Icd10Datasource: any[] = [
        {
            "id": "0",
            "kode_icd_10": "",
            "nama_icd_10": "Semua Diagnosa",
            "sab": " "
        }
    ];

    KeywordSearch$ = new BehaviorSubject(null);

    @ViewChild('GridComps') GridComps!: GridComponent;

    GridProps: GridModel.IGrid = {
        id: 'laporan_kunjungan',
        column: [
            { field: 'tanggal_visit', headerName: 'Tgl. Visit', format: 'date' },
            { field: 'no_pendaftaran', headerName: 'No. Pendaftaran', },
            { field: 'no_rekam_medis', headerName: 'No. RM', },
            { field: 'nama_lengkap', headerName: 'Nama Lengkap', },
            { field: 'concat', headerName: 'Diagnosis (ICD 10)', },
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
        private _rekamMedisService: RekamMedisService,
        private _authenticationService: AuthenticationService,
    ) {
        this.KeywordSearch$
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getAllIcd10(result);
                }
            })
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(args: any) {
        if (this.Periode) {
            if (args.id == 'cetak') {
                const el = document.getElementById('laporan_kunjungan') as HTMLElement;

                if (el) {
                    this._utilityService
                        .exportToPdf(
                            'laporan_kunjungan',
                            `Laporan Kunjungan`
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

    handleSearchIcd10(args: any) {
        this.KeywordSearch$.next(args.filter);
    }

    private getAllIcd10(keyword?: string) {
        this._rekamMedisService
            .getAllIcd10(keyword)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.Icd10Datasource = [
                    {
                        "id": "0",
                        "kode_icd_10": "",
                        "nama_icd_10": "Semua Diagnosa",
                        "sab": " "
                    },
                    ...result.data
                ];
            })
    }

    handleSearch(search: Date[], kode_icd_10: string) {
        if (search.length == 2) {
            const
                startDate = this._utilityService.onFormatDate(search[0], 'DD/MM/yyyy'),
                endDate = this._utilityService.onFormatDate(search[1], 'DD/MM/yyyy'),
                startDateParams = this._utilityService.onFormatDate(search[0], 'yyyy-MM-DD'),
                endDateParams = this._utilityService.onFormatDate(search[1], 'yyyy-MM-DD');

            this.Periode = `${startDate} s.d ${endDate}`;

            this._laporanService
                .getLaporanKunjungan(startDateParams, endDateParams, kode_icd_10)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.GridProps.dataSource = result.data;
                })

        }
    }

}
