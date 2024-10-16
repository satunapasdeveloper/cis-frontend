import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, formatCurrency, formatDate } from '@angular/common';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Store } from '@ngxs/store';
import { BerandaState } from 'src/app/store/beranda';

@Component({
    selector: 'app-beranda',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        NgApexchartsModule
    ],
    templateUrl: './beranda.component.html',
    styleUrls: ['./beranda.component.scss']
})
export class BerandaComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    UserData$ =
        this._authenticationService.UserData$
            .pipe(takeUntil(this.Destroy$));

    Menu: any[] = [];

    PasienTerlayani: number = 24;

    TotalPasien: number = 155;

    DokterPraktekHariIni: number = 3;

    TindakanMedisHariIni: number = 10;

    DokterPraktekHariIniDatasource: any[] = [];

    PenyakitTerpopuler: any[] = [];

    ChartPendapatan: any = {};

    constructor(
        private _store: Store,
        private _router: Router,
        private _utilityService: UtilityService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this._prepareChartData();

        // Attach SVG fill fixer to all ApexCharts
        (window as any)['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };

        this.getDashboard();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDashboard() {
        this._store
            .select(BerandaState.berandaDashboardEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.DokterPraktekHariIniDatasource = result.jadwal_dokter;
                this.PasienTerlayani = result.pasien_terlayani_today;
                this.TotalPasien = result.total_pasien;
                this.DokterPraktekHariIni = result.dokter_praktek_today;
                this.TindakanMedisHariIni = result.tindakan_medis_today;
                this.PenyakitTerpopuler = result.penyakit_popular;

                this.ChartPendapatan.labels = [];
                this.ChartPendapatan.labels = result.pendapatan.map((item: any) => formatDate(item.tanggal, 'dd-MM-yyyy', 'EN'));

                this.ChartPendapatan.series = [];
                this.ChartPendapatan.series = [
                    {
                        name: 'Jumlah Pendapatan',
                        data: result.pendapatan.map((item: any) => item.total_pendapatan),
                    }
                ];
            })
    }

    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill')!.indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill')!;
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    private _prepareChartData(): void {
        this.ChartPendapatan = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
                formatter: function (value: number) {
                    return formatCurrency(value, 'EN', 'Rp. ')
                },
                style: {
                    fontSize: '11px'
                }
            },
            grid: {
                borderColor: '#D1D5DB',
            },
            labels: [''],
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: [0],
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
                y: {
                    formatter: function (value: any) {
                        return formatCurrency(value, 'EN', 'Rp. ')
                    }
                }
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: '#D1D5DB',
                },
                labels: {
                    style: {
                        colors: '#1F2937',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: '#374151',
                    },
                    formatter: function (value: any) {
                        return formatCurrency(value, 'EN', 'Rp. ')
                    }
                },
            },
        };
    }

    handleNavigateToPendaftaranPasienBaru() {
        this._router.navigateByUrl("/pis/pendaftaran-pasien-baru");
    }
}
