import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { map, Subject, takeUntil } from 'rxjs';
import { PostRequestByDynamicFiterModel } from 'src/app/model/http/http-request.model';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { RekamMedisActions, RekamMedisState } from 'src/app/store/rekam-medis';
import { RiwayatRekamMedisComponent } from '../../riwayat-rekam-medis/riwayat-rekam-medis.component';
import { RekamMedisModel } from 'src/app/model/pages/rekam-medis/rekam-medis.model';

@Component({
    selector: 'app-informasi-pasien',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        RiwayatRekamMedisComponent,
    ],
    templateUrl: './informasi-pasien.component.html',
    styleUrl: './informasi-pasien.component.scss'
})
export class InformasiPasienComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    Pasien: any;

    RiwayatRekamMedis: any[] = [];

    ShowDialogDetail = false;

    constructor(
        private _store: Store,
        private _activatedRoute: ActivatedRoute,
        private _rekamMedisService: RekamMedisService
    ) { }

    ngOnInit(): void {
        this.Pasien = JSON.parse(localStorage.getItem('_SPSH_') as any);

        console.log("pasien =>", this.Pasien);

        if (this.Pasien) {
            this.getRiwayatRekamMedis(this.Pasien.no_rekam_medis, this.Pasien.id_pendaftaran!);
        } else {
            this._store
                .select(RekamMedisState.rekamMedisDetail)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.Pasien = result;
                    this.getRiwayatRekamMedis(result?.no_rekam_medis!, result?.id_pendaftaran!);
                })
        }
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getRiwayatRekamMedis(no_rekam_medis: string, id_pendaftaran: string) {
        const filter: PostRequestByDynamicFiterModel[] = [
            {
                columnName: 'pasien.no_rekam_medis',
                filter: 'like',
                searchText: no_rekam_medis,
                searchText2: '',
                withOr: false
            },
            {
                columnName: 'pendaftaran.status_billing',
                filter: 'equal',
                searchText: 'true',
                searchText2: '',
                withOr: false
            },
        ];

        this._rekamMedisService
            .getAll(filter)
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return result.data.filter((item) => {
                        item.tanggal_visit = formatDate(new Date(item.tanggal_visit), 'dd-MM-yyyy', 'EN');

                        return item.id_pendaftaran != id_pendaftaran
                    });
                })
            )
            .subscribe((result) => {
                this.RiwayatRekamMedis = result;
            })
    }

    handleOpenDialogDetailRiwayatRekamMedis(data: RekamMedisModel.IRekamMedis) {
        this._store
            .dispatch(new RekamMedisActions.GetResumeMedis(data.id_pendaftaran))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.rekam_medis.success) {
                    this.ShowDialogDetail = true;
                }
            });
    }
}
