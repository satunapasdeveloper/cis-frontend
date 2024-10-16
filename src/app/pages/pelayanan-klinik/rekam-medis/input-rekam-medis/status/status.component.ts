import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { map, Subject, takeUntil } from 'rxjs';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-status',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './status.component.html',
    styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    Status: any[] = [];

    SelectedStatus: string = "";

    constructor(
        private _store: Store,
        private _cdr: ChangeDetectorRef
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
        this._store
            .select(RekamMedisState.rekamMedisVariable)
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return result?.status_pulang
                })
            )
            .subscribe((result) => {
                this.Status = result as any;
            })
    }

    private getStatusPulangPasien() {
        this._store
            .select(RekamMedisState.rekamMedisDetail)
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return result?.status_pulang
                })
            )
            .subscribe((result) => {
                this.SelectedStatus = result as any;
                this._cdr.detectChanges();
            })
    }
}
