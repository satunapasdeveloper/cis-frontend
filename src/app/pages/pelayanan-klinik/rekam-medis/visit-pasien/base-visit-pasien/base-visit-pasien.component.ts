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
import { VpAssesmentComponent } from '../vp-assesment/vp-assesment.component';
import { VpPlanComponent } from '../vp-plan/vp-plan.component';
import { StatusComponent } from '../../input-rekam-medis/status/status.component';
import { PendaftaranRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/pendaftaran-rawat-jalan.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-base-visit-pasien',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        StepperModule,
        VpPlanComponent,
        DashboardComponent,
        VpAssesmentComponent,
        VpObjectiveComponent,
        VpSubjectiveComponent,
        StatusComponent,
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

    @ViewChild('VpAssesmentComps') VpAssesmentComps!: VpAssesmentComponent;

    @ViewChild('VpPlanComps') VpPlanComps!: VpPlanComponent;

    @ViewChild('VpStatusComps') VpStatusComps!: StatusComponent;

    constructor(
        private _router: Router,
        private _messageService: MessageService,
        private _pendaftaranRawatJalanService: PendaftaranRawatJalanService,
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

    handleSaveStatusPulang() {
        this._pendaftaranRawatJalanService
            .updateStatus(this.VpStatusComps.onSaveStatus())
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Status Pendaftaran Berhasil Diubah' });
                    setTimeout(() => {
                        this._router.navigateByUrl('pelayanan-klinik/rawat-jalan/antrian-poliklinik');
                    }, 1500);
                }
            })
    }
}
