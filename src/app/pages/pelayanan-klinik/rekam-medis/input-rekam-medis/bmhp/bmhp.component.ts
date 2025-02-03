import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { Router } from '@angular/router';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { VpPlanBmhpComponent } from '../../visit-pasien/vp-plan/vp-plan-bmhp/vp-plan-bmhp.component';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';

@Component({
    selector: 'app-bmhp',
    standalone: true,
    imports: [
        DashboardComponent,
        InformasiPasienComponent,
        VpPlanBmhpComponent,
    ],
    templateUrl: './bmhp.component.html',
    styleUrl: './bmhp.component.scss'
})
export class BmhpComponent implements OnInit, OnDestroy {

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        },
    ];

    @ViewChild('VpPlanBmhpComps') VpPlanBmhpComps!: VpPlanBmhpComponent;

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
