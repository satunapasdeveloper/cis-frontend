import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
    selector: 'app-header-laporan',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './header-laporan.component.html',
    styleUrl: './header-laporan.component.scss'
})
export class HeaderLaporanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    @Input('title') title: string = "Laporan";

    @Input('periode') periode: string = "-";

    UserData$ = this._authenticationService.getUserData();

    constructor(
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}
