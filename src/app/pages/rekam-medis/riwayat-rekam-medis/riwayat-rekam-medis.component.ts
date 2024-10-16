import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, map, Subject, takeUntil, tap } from 'rxjs';
import { PasienModel } from 'src/app/model/pages/pasien/pasien.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PasienService } from 'src/app/services/pasien/pasien.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-riwayat-rekam-medis',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './riwayat-rekam-medis.component.html',
    styleUrl: './riwayat-rekam-medis.component.scss'
})
export class RiwayatRekamMedisComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    UserData$ = this._authenticationService.getUserData();

    ResumeMedis$ = this._store
        .select(RekamMedisState.rekamMedisResumeMedis)
        .pipe(
            takeUntil(this.Destroy$),
            map((result) => {
                if (result) {
                    let racikan: any[] = [];

                    result?.resep?.racikan.forEach((item) => {
                        item.racikan.forEach((obat) => {
                            racikan.push({
                                aturan_pakai: item.aturan_pakai,
                                harga: obat.harga,
                                id_item: obat.id_item,
                                nama_obat: obat.nama_obat,
                                qty: obat.qty,
                                rute_pemberian: item.rute_pemberian,
                                subtotal: obat.subtotal,
                                waktu: item.waktu,
                                waktu_spesifik: item.waktu_spesifik,
                            })
                        })
                    });

                    return {
                        ...result,
                        resep: {
                            ...result?.resep,
                            racikan: racikan
                        }
                    };
                } else {
                    return null;
                }
            }),
            tap((result) => {
                if (result) {
                    if (result.id_pasien) {
                        this.getDetailPasien(result?.id_pasien!);
                    }
                }
            })
        );

    Pasien$ = new BehaviorSubject<PasienModel.IPasien>(null as any);

    constructor(
        private _store: Store,
        private _pasienService: PasienService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDetailPasien(id_pasien: string) {
        this._pasienService
            .getById(id_pasien)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.Pasien$.next(result.data);
            })
    }

    formatDate(date: string): string {
        return formatDate(new Date(date), 'dd-MM-yyyy', 'EN');
    }

    getDiagnosaPrimer(data: any[]) {
        const diagnosa = data.find(item => item.jenis_diagnosis == 'Diagnosa Utama / Primer');
        return diagnosa ? `${diagnosa.kode_icd10} - ${diagnosa.display_icd10}` : null;
    }

    getDiagnosaSekunder(data: any[]) {
        const diagnosa = data.find(item => item.jenis_diagnosis == 'Diagnosa Tambahan / Sekunder');
        return diagnosa ? `${diagnosa.kode_icd10} - ${diagnosa.display_icd10}` : null;
    }
}
