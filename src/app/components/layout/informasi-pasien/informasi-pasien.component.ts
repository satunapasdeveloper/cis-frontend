import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { PendaftaranRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/pendaftaran-rawat-jalan.service';

@Component({
    selector: 'app-informasi-pasien',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
    ],
    templateUrl: './informasi-pasien.component.html',
    styleUrl: './informasi-pasien.component.scss'
})
export class InformasiPasienComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    Pasien: any;

    ToggleCard = true;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _pendaftaranRawatJalanService: PendaftaranRawatJalanService
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem("_SPSH_")) {
            this.Pasien = JSON.parse(localStorage.getItem("_SPSH_") as any)
        };
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    getByIdRegister(id_register: any) {
        const url = this._router.url[0];
        console.log("url =>", url);

        this._pendaftaranRawatJalanService
            .getByIdRegister(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.Pasien = result.data;
                }
            })
    }

    toggleCard() {
        this.ToggleCard = !this.ToggleCard;
        const el = document.getElementById('cardPasien') as HTMLElement;

        if (this.ToggleCard) {
            el.classList.remove("hidden");
            el.classList.add("flex");
        } else {
            el.classList.remove("flex");
            el.classList.add("hidden");
        }
    }
}
