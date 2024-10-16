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

    SidebarMenu$ = new BehaviorSubject<AuthenticationModel.ISidebarMenu[]>([
        {
            id: '1',
            caption: 'Setup Data',
            icon: 'pi pi-cog',
            toggle_child: false,
            sidebarChild: [
                {
                    id: '11',
                    caption: 'Setup Poli',
                    icon: 'pi pi-shop',
                    toggle_child: false,
                    url: '/setup-data/setup-poli'
                },
                {
                    id: '12',
                    caption: 'Setup Item',
                    icon: 'pi pi-clone',
                    toggle_child: false,
                    url: '/setup-data/setup-item'
                },
                {
                    id: '13',
                    caption: 'Setup Tindakan Medis',
                    icon: 'pi pi-arrows-alt',
                    toggle_child: false,
                    url: '/setup-data/setup-tindakan-medis'
                },
                {
                    id: '14',
                    caption: 'Setup Rekanan Penunjang',
                    icon: 'pi pi-address-book',
                    toggle_child: false,
                    url: '/setup-data/setup-rekanan-penunjang'
                },
                {
                    id: '15',
                    caption: 'Manajemen User',
                    icon: 'pi pi-users',
                    toggle_child: false,
                    url: '/setup-data/manajemen-user'
                },
            ]
        },
        {
            id: '2',
            caption: 'Pasien',
            icon: 'pi pi-users',
            toggle_child: false,
            url: '/pasien'
        },
        // {
        //     id: '3',
        //     caption: 'Dokter',
        //     icon: 'pi pi-shield',
        //     toggle_child: false,
        //     url: '/dokter'
        // },
        {
            id: '4',
            caption: 'Antrian',
            icon: 'pi pi-list-check',
            toggle_child: false,
            url: '/antrian'
        },
        {
            id: '5',
            caption: 'Rekam Medis',
            icon: 'pi pi-file-edit',
            toggle_child: false,
            url: '/rekam-medis/data'
        },
        {
            id: '7',
            caption: 'Layanan Dokumen',
            icon: 'pi pi-file-o',
            toggle_child: false,
            sidebarChild: [
                {
                    id: '71',
                    caption: 'Resume Medis',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/layanan-dokumen/resume-medis'
                },
                {
                    id: '72',
                    caption: 'Surat Sehat',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/layanan-dokumen/surat-sehat'
                },
                {
                    id: '73',
                    caption: 'Surat Sakit',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/layanan-dokumen/surat-sakit'
                },
                {
                    id: '74',
                    caption: 'Surat Rujukan',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/layanan-dokumen/surat-rujukan'
                },
                {
                    id: '74',
                    caption: 'Invoice',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/layanan-dokumen/invoice'
                },
            ]
        },
        {
            id: '8',
            caption: 'Laporan',
            icon: 'pi pi-folder',
            toggle_child: false,
            sidebarChild: [
                {
                    id: '81',
                    caption: 'Laporan Pendapatan',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/laporan/laporan-pendapatan'
                },
                {
                    id: '82',
                    caption: 'Laporan Penyakit',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/laporan/laporan-penyakit'
                },
                {
                    id: '83',
                    caption: 'Laporan Kunjungan',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/laporan/laporan-kunjungan'
                },
                {
                    id: '84',
                    caption: 'Laporan Kunjungan Harian',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/laporan/laporan-kunjungan-harian'
                },
                {
                    id: '85',
                    caption: 'Laporan Pemakaian Obat & BMHP',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/laporan/laporan-pemakaian-obat-dan-bmhp'
                },
            ]
        },
    ]);

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

    private handleSignIn(data: AuthenticationModel.IAuthentication) {
        localStorage.clear();
        localStorage.setItem("_CISUD_", JSON.stringify(data));
    }
}
