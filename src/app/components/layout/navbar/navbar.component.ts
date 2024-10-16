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
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule,
        DividerModule,
        DialogModule,
        InputTextModule,
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

    ShowSearch = false;

    OriginalMenu = this.getMenu();

    Menu: any[] = this.getMenu();

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
        this.SelectedNavbarMenu = item;
        this._authenticationService.setSidebarMenu(item.id);
        this._utilityService.ShowSidebar$.next(true);
    }

    handleToggleSidebar() {
        const state: boolean = this._utilityService.ShowSidebar$.value;
        this._utilityService.ShowSidebar$.next(!state);
    }

    handleToggleTopMenu() {
        this.ShowTopMenu = !this.ShowTopMenu;
        this._utilityService.ShowTopMenu$.next(this.ShowTopMenu);
    }

    getMenu(): any {
        const menu = this._authenticationService.AllSidebarMenu$.value;

        let flatArray: any[] = [];

        function flatten(item: any) {
            const { sidebarChild, url, ...rest } = item;
            // Only push items that have a URL
            if (url) {
                flatArray.push({ ...rest, url });
            }
            if (sidebarChild) {
                sidebarChild.forEach(flatten);
            }
        }

        menu.forEach(flatten);
        return flatArray;
    }

    handleFilterMenu(keyword: string) {
        this.Menu = this.OriginalMenu;

        if (keyword) {
            this.Menu = this.Menu.filter(item => item.caption.toLowerCase().includes(keyword.toLowerCase()));
        } else {
            this.Menu = this.OriginalMenu;
        }
    }

    handleNavigateToMenu(menu: AuthenticationModel.ISidebarMenu) {
        const selectedNavbar = this._authenticationService.NavbarMenu$.value.find(item => item.id == menu.navbar_id);
        this.SelectedNavbarMenu = selectedNavbar;
        this._authenticationService.setSidebarMenu(selectedNavbar!.id);
        localStorage.setItem('_CIS_ACTIVE_MENU_', JSON.stringify(selectedNavbar));

        this._router.navigateByUrl(menu.url!);
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
