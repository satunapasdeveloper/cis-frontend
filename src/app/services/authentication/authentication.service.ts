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
            caption: 'Setup Data',
            icon: 'pi pi-cog',
            toggle_child: false,
            sidebarChild: [
                {
                    id: '111',
                    caption: 'Setup Kelas',
                    icon: 'pi pi-list-check',
                    toggle_child: false,
                    url: '/pendaftaran/setup-data/setup-kelas'
                },
                {
                    id: '112',
                    caption: 'Setup Unit',
                    icon: 'pi pi-building-columns',
                    toggle_child: false,
                    url: '/pendaftaran/setup-data/setup-unit'
                },
            ]
        },
        {
            id: '12',
            navbar_id: '1',
            caption: 'Pasien',
            icon: 'pi pi-users',
            toggle_child: false,
            url: '/pendaftaran/pasien'
        },
        {
            id: '13',
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
                    id: '211',
                    caption: 'Setup Kategori Kamar',
                    icon: 'pi pi-filter-slash',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-kategori-kamar'
                },
                {
                    id: '212',
                    caption: 'Setup Kamar',
                    icon: 'pi pi-sitemap',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-kamar'
                },
                {
                    id: '213',
                    caption: 'Setup Bed',
                    icon: 'pi pi-tag',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-bed'
                },
                {
                    id: '214',
                    caption: 'Setup Poli',
                    icon: 'pi pi-shop',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-poli'
                },
                {
                    id: '215',
                    caption: 'Setup Penjamin',
                    icon: 'pi pi-lock',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-penjamin'
                },
                {
                    id: '216',
                    caption: 'Setup Jabatan',
                    icon: 'pi pi-pencil',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-jabatan'
                },
                {
                    id: '217',
                    caption: 'Setup Role',
                    icon: 'pi pi-star-fill',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-role'
                },
                {
                    id: '218',
                    caption: 'Setup Nakes',
                    icon: 'pi pi-users',
                    toggle_child: false,
                    url: '/pelayanan-klinik/setup-data/setup-nakes'
                },
                // {
                //     id: '12',
                //     caption: 'Setup Item',
                //     icon: 'pi pi-clone',
                //     toggle_child: false,
                //     url: '/pelayanan-klinik/setup-data/setup-item'
                // },
                // {
                //     id: '13',
                //     caption: 'Setup Tindakan Medis',
                //     icon: 'pi pi-arrows-alt',
                //     toggle_child: false,
                //     url: '/pelayanan-klinik/setup-data/setup-tindakan-medis'
                // },
                // {
                //     id: '14',
                //     caption: 'Setup Rekanan Penunjang',
                //     icon: 'pi pi-address-book',
                //     toggle_child: false,
                //     url: '/pelayanan-klinik/setup-data/setup-rekanan-penunjang'
                // },
                // {
                //     id: '15',
                //     caption: 'Manajemen User',
                //     icon: 'pi pi-users',
                //     toggle_child: false,
                //     url: '/pelayanan-klinik/setup-data/manajemen-user'
                // },
            ]
        },
        {
            id: '22',
            navbar_id: '2',
            caption: 'Dokter',
            icon: 'pi pi-users',
            toggle_child: false,
            url: '/pelayanan-klinik/dokter'
        },
        {
            id: '23',
            navbar_id: '2',
            caption: 'Rekam Medis',
            icon: 'pi pi-file-edit',
            toggle_child: false,
            url: '/pelayanan-klinik/rekam-medis/data'
        },
        // !! Farmasi Sidebar Menu
        {
            id: '41',
            navbar_id: '4',
            caption: 'Setup Data',
            icon: 'pi pi-cog',
            toggle_child: false,
            sidebarChild: [
                {
                    id: '411',
                    caption: 'Setup Item',
                    icon: 'pi pi-clone',
                    toggle_child: false,
                    url: '/farmasi/setup-data/setup-item'
                },
                {
                    id: '412',
                    caption: 'Setup Supplier',
                    icon: 'pi pi-address-book',
                    toggle_child: false,
                    url: '/farmasi/setup-data/setup-supplier'
                },
                {
                    id: '413',
                    caption: 'Setup Pabrik',
                    icon: 'pi pi-warehouse',
                    toggle_child: false,
                    url: '/farmasi/setup-data/setup-pabrik'
                },
                {
                    id: '414',
                    caption: 'Setup Stockroom',
                    icon: 'pi pi-building-columns',
                    toggle_child: false,
                    url: '/farmasi/setup-data/setup-stockroom'
                },
                {
                    id: '415',
                    caption: 'Setup Golongan',
                    icon: 'pi pi-microchip',
                    toggle_child: false,
                    url: '/farmasi/setup-data/setup-golongan'
                },
            ]
        },
        {
            id: '42',
            navbar_id: '4',
            caption: 'Purchasing',
            icon: 'pi pi-box',
            toggle_child: false,
            sidebarChild: [
                {
                    id: '411',
                    caption: 'Pemesanan PO',
                    icon: 'pi pi-file',
                    toggle_child: false,
                    url: '/farmasi/purchasing/pemesanan-po/history'
                },
                {
                    id: '412',
                    caption: 'Penerimaan Barang',
                    icon: 'pi pi-expand',
                    toggle_child: false,
                    url: '/farmasi/purchasing/penerimaan-barang/history'
                },
                {
                    id: '413',
                    caption: 'Retur Pembelian',
                    icon: 'pi pi-arrow-up-left',
                    toggle_child: false,
                    url: '/farmasi/purchasing/retur-pembelian/history'
                },
                {
                    id: '414',
                    caption: 'Penerimaan Konsinyasi',
                    icon: 'pi pi-link',
                    toggle_child: false,
                    url: '/farmasi/purchasing/penerimaan-konsinyasi/history'
                },
                {
                    id: '415',
                    caption: 'Retur Konsinyasi',
                    icon: 'pi pi-arrow-up-left',
                    toggle_child: false,
                    url: '/farmasi/purchasing/retur-konsinyasi/history'
                },
            ]
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
            .postRequest(`https://apidevklinik.satunapas.com/api/v1/satunapas/auth/login`, payload)
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
            .getRequest(`https://apidevklinik.satunapas.com/api/v1/satunapas/profile_layanan/ProfileLayanan`)
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
