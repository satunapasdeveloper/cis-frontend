import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationModel } from 'src/app/model/pages/authentication/authentication.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    UserData$ = new BehaviorSubject<AuthenticationModel.IAuthentication>({} as any);

    NavbarMenu$ = new BehaviorSubject<AuthenticationModel.INavbarMenu[]>([
        {
            id: '1',
            caption: 'Pendaftaran',
            icon: 'pi pi-user'
        },
        {
            id: '2',
            caption: 'Pelayanan Klinik',
            icon: 'pi pi-user'
        },
        {
            id: '3',
            caption: 'Billing Kasir',
            icon: 'pi pi-user'
        },
        {
            id: '4',
            caption: 'Farmasi',
            icon: 'pi pi-user'
        },
        {
            id: '5',
            caption: 'Layanan Dokumen',
            icon: 'pi pi-user'
        },
        {
            id: '6',
            caption: 'Laporan',
            icon: 'pi pi-user'
        },
    ]);

    AllSidebarMenu$ = new BehaviorSubject<AuthenticationModel.ISidebarMenu[]>([
        // !! Pendaftaran Sidebar Menu
        {
            id: '11',
            navbar_id: '1',
            caption: 'Pasien',
            icon: 'pi pi-users',
            toggle_child: false,
            url: '/pendaftaran/pasien'
        },
        {
            id: '12',
            navbar_id: '1',
            caption: 'Antrian',
            icon: 'pi pi-list-check',
            toggle_child: false,
            url: '/pendaftaran/antrian'
        },
        // !! Pelayanan Klinik Sidebar Menu
        {
            id: '21',
            navbar_id: '2',
            caption: 'Setup Data',
            icon: 'pi pi-cog',
            toggle_child: false,
            sidebarChild: [
                {
                    id: '11',
                    caption: 'Setup Poli',
                    icon: 'pi pi-shop',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-poli'
                },
                {
                    id: '12',
                    caption: 'Setup Item',
                    icon: 'pi pi-clone',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-item'
                },
                {
                    id: '13',
                    caption: 'Setup Tindakan Medis',
                    icon: 'pi pi-arrows-alt',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-tindakan-medis'
                },
                {
                    id: '14',
                    caption: 'Setup Rekanan Penunjang',
                    icon: 'pi pi-address-book',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-rekanan-penunjang'
                },
                {
                    id: '15',
                    caption: 'Manajemen User',
                    icon: 'pi pi-users',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/manajemen-user'
                },
            ]
        },
        {
            id: '22',
            navbar_id: '2',
            caption: 'Rekam Medis',
            icon: 'pi pi-file-edit',
            toggle_child: false,
            url: '/pelayanan-klinik/rekam-medis/data'
        },
        // !! Layanan Dokumen Sidebar Menu
        {
            id: '51',
            navbar_id: '5',
            caption: 'Resume Medis',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/layanan-dokumen/resume-medis'
        },
        {
            id: '52',
            navbar_id: '5',
            caption: 'Surat Sehat',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/layanan-dokumen/surat-sehat'
        },
        {
            id: '53',
            navbar_id: '5',
            caption: 'Surat Sakit',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/layanan-dokumen/surat-sakit'
        },
        {
            id: '54',
            navbar_id: '5',
            caption: 'Surat Rujukan',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/layanan-dokumen/surat-rujukan'
        },
        {
            id: '55',
            navbar_id: '5',
            caption: 'Invoice',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/layanan-dokumen/invoice'
        },
        // !! Laporan Sidebar Menu
        {
            id: '61',
            navbar_id: '6',
            caption: 'Laporan Pendapatan',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/laporan/laporan-pendapatan'
        },
        {
            id: '62',
            navbar_id: '6',
            caption: 'Laporan Penyakit',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/laporan/laporan-penyakit'
        },
        {
            id: '63',
            navbar_id: '6',
            caption: 'Laporan Kunjungan',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/laporan/laporan-kunjungan'
        },
        {
            id: '64',
            navbar_id: '6',
            caption: 'Laporan Kunjungan Harian',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/laporan/laporan-kunjungan-harian'
        },
        {
            id: '65',
            navbar_id: '6',
            caption: 'Laporan Pemakaian Obat & BMHP',
            icon: 'pi pi-file',
            toggle_child: false,
            url: '/laporan/laporan-pemakaian-obat-dan-bmhp'
        },
    ]);

    SidebarMenu$ = new BehaviorSubject<AuthenticationModel.ISidebarMenu[]>([]);

    constructor(
        private _cookieService: CookieService,
        private _httpRequestService: HttpRequestService,
    ) { }

    signIn(payload: AuthenticationModel.ISignIn): Observable<AuthenticationModel.SignIn> {
        return this._httpRequestService
            .postRequest(`${environment.webApiUrl}/satunapas/auth/login`, payload)
            .pipe(
                tap((result) => {
                    if (result.responseResult) {
                        this.handleSignIn(result.data);
                    }
                })
            )
    }

    getProfile() {
        this._httpRequestService
            .getRequest(`${environment.webApiUrl}/satunapas/profile_layanan/ProfileLayanan`)
            .pipe(
                tap((result) => {
                    if (result.responseResult) {
                        localStorage.setItem("_CISPL_", JSON.stringify(result.data));
                    }
                })
            )
            .subscribe((result) => {

            })
    }

    setUserData() {
        const user_data = localStorage.getItem("_CISUD_");
        const layanan_data = localStorage.getItem("_CISPL_");
        this.UserData$.next({ ...JSON.parse(user_data as any), ...JSON.parse(layanan_data as any) });
    }

    getUserData() {
        const user_data = localStorage.getItem("_CISUD_");
        const layanan_data = localStorage.getItem("_CISPL_");
        return { ...JSON.parse(user_data as any), ...JSON.parse(layanan_data as any) };
    }

    setSidebarMenu(navbar_id: string) {
        const sidebarMenu = this.AllSidebarMenu$.value.filter(item => item.navbar_id == navbar_id);
        localStorage.setItem('_CIS_MENU_SIDEBAR_', JSON.stringify(sidebarMenu));
        this.SidebarMenu$.next(sidebarMenu);
    }

    getSidebarMenu() {
        const sidebarMenu = JSON.parse(localStorage.getItem('_CIS_MENU_SIDEBAR_')!);
        this.SidebarMenu$.next(sidebarMenu)
    }

    private handleSignIn(data: AuthenticationModel.IAuthentication) {
        localStorage.clear();
        localStorage.setItem("_CISUD_", JSON.stringify(data));
    }
}
