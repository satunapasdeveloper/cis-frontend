import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map, Subject, takeUntil } from 'rxjs';
import { PendaftaranRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/pendaftaran-rawat-jalan.service';
import { KondisiPulangService } from 'src/app/services/pelayanan-klinik/setup-data/kondisi-pulang.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-status',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        InputTextareaModule,
    ],
    templateUrl: './status.component.html',
    styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    Status: any[] = [];

    SelectedStatus: number = 0;

    StatusForSave: string = "";

    Catatan: string = "";

    constructor(
        private _store: Store,
        private _cdr: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _kondisiPulangService: KondisiPulangService,
        private _pendaftaranRawatJalanService: PendaftaranRawatJalanService,
    ) { }

    ngOnInit(): void {
        this.getAllStatusPulangVariable();
    }

    ngAfterViewInit(): void {
        this.getStatusPulangPasien();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAllStatusPulangVariable() {
        this._kondisiPulangService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.Status = result.data.rows;
            })
    }

    private getStatusPulangPasien() {
        const id_register = this._activatedRoute.snapshot.queryParams['id_register'];

        this._pendaftaranRawatJalanService
            .getByIdRegister(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.SelectedStatus = result.data.id_kondisi_pulang;
                }
            })
    }

    onSaveStatus() {
        return {
            id_register: this._activatedRoute.snapshot.queryParams['id_register'],
            status: this.StatusForSave,
            catatan_pulang: this.Catatan
        }
    }
}
