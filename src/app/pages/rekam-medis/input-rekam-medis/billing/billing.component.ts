import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subject, takeUntil, tap } from 'rxjs';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';

@Component({
    selector: 'app-billing',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputNumberModule,
    ],
    templateUrl: './billing.component.html',
    styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    Billing: any;

    Diskon: any = 0;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _rekamMedisService: RekamMedisService
    ) { }

    ngOnInit(): void {
        this.getTagihan(this._activatedRoute.snapshot.queryParams['id']);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getTagihan(id_pendaftaran: string) {
        this._rekamMedisService
            .getTagihan(id_pendaftaran)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.Billing = result.data;
                }
            })
    }

    handleChangeDiskon(args: any) {
        this.Billing.diskon = args;
        this.Billing.total = this.Billing.subtotal - args;
    }
}
