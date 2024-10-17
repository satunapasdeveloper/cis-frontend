import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { SetupPoliActions } from './store/setup-data/setup-poli';
import { SetupTindakanMedisActions } from './store/setup-data/tindakan-medis';
import { SetupItemActions } from './store/setup-data/item';
import { ManajemenUserActions } from './store/setup-data/manajemen-user';
import { RekamMedisActions } from './store/rekam-medis';
import { RekananPenunjangActions } from './store/setup-data/rekanan-penunjang';
import { BerandaActions } from './store/beranda';
import { SetupSupplierActions } from './store/farmasi/setup-data/setup-supplier';
import { SetupPabrikActions } from './store/farmasi/setup-data/setup-pabrik';
import { SetupStockroomActions } from './store/farmasi/setup-data/setup-stockroom';
import { SetupGolonganActions } from './store/farmasi/setup-data/setup-golongan';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    title = 'frontend-cis';

    Destroy$ = new Subject();

    isLoading = false;

    IsFarmasiStateHitted = false;

    constructor(
        private _store: Store,
        private _router: Router,
        private _renderer: Renderer2,
    ) {
        this._router.events
            .pipe(takeUntil(this.Destroy$))
            .subscribe((event: any) => {
                if (event instanceof NavigationEnd) {

                    // ** Load farmasi state
                    if (event.url.includes('farmasi') && !this.IsFarmasiStateHitted) {
                        this.initAllFarmasiState();
                    }
                }
            });
    }

    ngOnInit(): void {
        const isUserLoggedIn = localStorage.getItem('_CISUD_');

        if (isUserLoggedIn) {
            // this.initAllNeededState();
            this.isLoading = false;
        } else {
            this.isLoading = false;
        }
    }

    private initAllNeededState() {
        // ** Get All
        this._store
            .dispatch(new BerandaActions.GetAll())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Poli
        this._store
            .dispatch(new SetupPoliActions.GetAllPoli())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Tindakan Medis
        this._store
            .dispatch(new SetupTindakanMedisActions.GetAllTindakanMedis())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Item
        this._store
            .dispatch(new SetupItemActions.GetAllItem())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Rekanan Penunjang
        this._store
            .dispatch(new RekananPenunjangActions.GetAllRekananPenunjang())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All User
        this._store
            .dispatch(new ManajemenUserActions.GetAllUser())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All User Dokter
        this._store
            .dispatch(new ManajemenUserActions.GetAllUserDokter())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Variable Rekam Medis
        this._store
            .dispatch(new RekamMedisActions.GetAllVariableRekamMedis())
            .pipe(takeUntil(this.Destroy$));
    }

    private initAllFarmasiState() {
        this.IsFarmasiStateHitted = true;

        // ** Get All Item
        this._store
            .dispatch(new SetupItemActions.GetAllItem())
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Supplier
        this._store
            .dispatch(new SetupSupplierActions.GetAllSupplier({ page: 1, count: 5 }))
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Pabrik
        this._store
            .dispatch(new SetupPabrikActions.GetAllPabrik({ page: 1, count: 5 }))
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Stockroom
        this._store
            .dispatch(new SetupStockroomActions.GetAllStockroom({ page: 1, count: 5 }))
            .pipe(takeUntil(this.Destroy$));

        // ** Get All Golongan
        this._store
            .dispatch(new SetupGolonganActions.GetAllGolongan({ page: 1, count: 5 }))
            .pipe(takeUntil(this.Destroy$));
    }

    triggerAnimation() {
        const element = document.querySelector('.zoom-text') as HTMLElement;
        if (element) {
            this._renderer.removeClass(element, 'zoom-text');
            // Trigger reflow/repaint
            element.offsetHeight; // This forces a reflow
            this._renderer.addClass(element, 'zoom-text');
        }
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}
