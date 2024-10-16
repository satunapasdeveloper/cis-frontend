import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogResepNonRacikanComponent } from './dialog-resep-non-racikan/dialog-resep-non-racikan.component';
import { DialogResepRacikanComponent } from './dialog-resep-racikan/dialog-resep-racikan.component';
import { DialogResepManualComponent } from './dialog-resep-manual/dialog-resep-manual.component';
import { Store } from '@ngxs/store';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-resep',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DialogResepNonRacikanComponent,
        DialogResepRacikanComponent,
        DialogResepManualComponent,
        ButtonModule,
    ],
    templateUrl: './resep.component.html',
    styleUrl: './resep.component.scss'
})
export class ResepComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    ResepNonRacikan: any[] = [];

    @ViewChild('DialogResepNonRacikanComps') DialogResepNonRacikanComps!: DialogResepNonRacikanComponent;

    ResepRacikan: any[] = [];

    @ViewChild('DialogResepRacikanComps') DialogResepRacikanComps!: DialogResepRacikanComponent;

    ResepManual: any[] = [];

    constructor(
        private _store: Store,
        private _cdr: ChangeDetectorRef,
        private _rekamMedisService: RekamMedisService
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.getResep();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getResep() {
        this._store
            .select(RekamMedisState.rekamMedisDetail)
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return result?.resep ? result.resep : null;
                })
            )
            .subscribe((result) => {
                this.ResepRacikan = result?.racikan ? result.racikan : [];
                this.ResepNonRacikan = result?.obat ? result.obat : [];
                this._cdr.detectChanges();
            })
    }

    onFormatAturanPakai(data: any) {
        const aturan_pakai = data.aturan_pakai ? data.aturan_pakai : `${data.aturan_pakai_kali},${data.aturan_pakai_catatan}`;
        const waktu_spesifik_pemberian_obat = data.waktu_spesifik_pemberian_obat ? data.waktu_spesifik_pemberian_obat : data.waktu_spesifik;
        const waktu_pemberian_obat = data.waktu_pemberian_obat ? data.waktu_pemberian_obat : data.waktu;
        return `${aturan_pakai} | ${waktu_spesifik_pemberian_obat} | ${waktu_pemberian_obat}`;
    }

    handleOpenDialogResepNonRacikan(state: 'insert' | 'update', index?: number, data?: any) {
        if (state == 'insert') {
            this.DialogResepNonRacikanComps.handleOpenDialog(state);
        } else {
            this.DialogResepNonRacikanComps.handleOpenDialog(state, index, data);
        }
    }

    handleSaveObatNonRacikan(args: any) {
        if (args.state == 'insert') {
            this.ResepNonRacikan.push(args.data);
        } else {
            this.ResepNonRacikan[args.index] = args.data;
        }
    }

    handleDeleteObatNonRacikan(index: number) {
        this.ResepNonRacikan.splice(index, 1);
    }

    handleOpenDialogResepRacikan(state: 'insert' | 'update', index?: number, data?: any) {
        if (state == 'insert') {
            this.DialogResepRacikanComps.handleOpenDialog(state);
        } else {
            this.DialogResepRacikanComps.handleOpenDialog(state, index, data);
        }
    }

    handleSaveObatRacikan(args: any) {
        if (args.state == 'insert') {
            this.ResepRacikan.push(args.data);
        } else {
            this.ResepRacikan[args.index] = args.data;
        }
    }

    handleDeleteObatRacikan(index: number) {
        this.ResepRacikan.splice(index, 1);
    }
}
