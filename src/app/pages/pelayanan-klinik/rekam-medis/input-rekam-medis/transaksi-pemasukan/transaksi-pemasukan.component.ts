import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';
import { VpPlanTindakanComponent } from '../../visit-pasien/vp-plan/vp-plan-tindakan/vp-plan-tindakan.component';

@Component({
    selector: 'app-transaksi-pemasukan',
    standalone: true,
    imports: [
        DashboardComponent,
        InformasiPasienComponent,
        VpPlanTindakanComponent,
    ],
    templateUrl: './transaksi-pemasukan.component.html',
    styleUrl: './transaksi-pemasukan.component.scss'
})
export class TransaksiPemasukanComponent implements OnInit, OnDestroy {

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        },
    ];

    @ViewChild('VpPlanTindakanComps') VpPlanTindakanComps!: VpPlanTindakanComponent;

    constructor(
        private _router: Router,
    ) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this._router.navigateByUrl("/pelayanan-klinik/rawat-jalan/antrian-poliklinik");
        };
    }
}
