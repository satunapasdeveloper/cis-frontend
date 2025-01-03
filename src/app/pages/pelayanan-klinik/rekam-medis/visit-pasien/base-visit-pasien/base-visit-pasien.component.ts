import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { Subject, takeUntil } from 'rxjs';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { Router } from '@angular/router';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';
import { ButtonModule } from 'primeng/button';
import { VpObjectiveComponent } from '../vp-objective/vp-objective.component';
import { VpSubjectiveComponent } from '../vp-subjective/vp-subjective.component';

@Component({
    selector: 'app-base-visit-pasien',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        StepperModule,
        DashboardComponent,
        VpObjectiveComponent,
        VpSubjectiveComponent,
        InformasiPasienComponent,
    ],
    templateUrl: './base-visit-pasien.component.html',
    styleUrl: './base-visit-pasien.component.scss'
})
export class BaseVisitPasienComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        }
    ];

    @ViewChild('VpSubjectiveComps') VpSubjectiveComps!: VpSubjectiveComponent;

    @ViewChild('VpObjectiveComps') VpObjectiveComps!: VpObjectiveComponent;

    constructor(
        private _router: Router,
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleBackToList() {
        this._router.navigateByUrl('/pelayanan-klinik/rawat-jalan/antrian-poliklinik');
    }

    handleCreateSubjective(nextCallback: any) {
        nextCallback.emit();
    }
}
