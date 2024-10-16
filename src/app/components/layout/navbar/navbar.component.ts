import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AuthenticationModel } from 'src/app/model/pages/authentication/authentication.model';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule,
        DividerModule
    ],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ShowTopMenu = false;

    NavbarMenu$ = this._authenticationService
        .NavbarMenu$
        .pipe(takeUntil(this.Destroy$));

    SelectedNavbarMenu: any;

    constructor(
        private _router: Router,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _authenticationService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.SelectedNavbarMenu = JSON.parse(localStorage.getItem('_CIS_ACTIVE_MENU_')!);
    }

    handleClickNavbarMenu(item: AuthenticationModel.INavbarMenu) {
        localStorage.setItem('_CIS_ACTIVE_MENU_', JSON.stringify(item));
        this.handleToggleSidebar();
    }

    handleToggleSidebar() {
        const state: boolean = this._utilityService.ShowSidebar$.value;
        this._utilityService.ShowSidebar$.next(!state);
    }

    handleToggleTopMenu() {
        this.ShowTopMenu = !this.ShowTopMenu;
        this._utilityService.ShowTopMenu$.next(this.ShowTopMenu);
    }

    onBackToBeranda() {
        this._router.navigateByUrl("/beranda");
    }

    onSignOut() {
        this._utilityService.ShowLoading$.next(true);

        setTimeout(() => {
            this._utilityService.ShowLoading$.next(false);
            this._messageService.clear();
            this._messageService.add({ severity: 'success', detail: 'Success', summary: 'Sign Out Berhasil' });
            this._router.navigateByUrl("");
            localStorage.clear();
        }, 2000);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}   
