import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/middleware/auth.guard';

export const pelayananRoutes: Routes = [
    {
        path: 'setup-data',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./setup-data/setup-data.routes')).setupDataRoutes
    },
    {
        path: 'rawat-jalan',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./rawat-jalan/rawat-jalan.routes')).rawatJalanRoutes
    },
    {
        path: 'rawat-inap',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./rawat-inap/rawat-inap.routes')).rawatInapRoutes
    },
    {
        path: 'dokter',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./dokter/dokter.component')).DokterComponent,
        data: {
            title: 'Dokter',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Dokter"
            ]
        }
    },
    {
        path: 'rekam-medis',
        children: [
            {
                path: 'assesment-awal',
                loadComponent: async () => (await import('./rekam-medis/input-rekam-medis/pemeriksaan-fisik/pemeriksaan-fisik.component')).PemeriksaanFisikComponent,
                data: {
                    title: 'Assesment Awal',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Assesment Awal"
                    ]
                },
            },
            {
                path: 'transaksi-pemasukan',
                loadComponent: async () => (await import('./rekam-medis/input-rekam-medis/transaksi-pemasukan/transaksi-pemasukan.component')).TransaksiPemasukanComponent,
                data: {
                    title: 'Transaksi Pemasukan',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Transaksi Pemasukan"
                    ]
                },
            },
            {
                path: 'bmhp',
                loadComponent: async () => (await import('./rekam-medis/input-rekam-medis/bmhp/bmhp.component')).BmhpComponent,
                data: {
                    title: 'Bahan Medis Habis Pakai',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Bahan Medis Habis Pakai"
                    ]
                },
            },
            {
                path: 'visit-pasien',
                loadComponent: async () => (await import('./rekam-medis/visit-pasien/base-visit-pasien/base-visit-pasien.component')).BaseVisitPasienComponent,
                data: {
                    title: 'Visit Pasien',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Visit Pasien"
                    ]
                },
            },
            {
                path: 'surat-kontrol',
                loadComponent: async () => (await import('./rekam-medis/surat-kontrol/surat-kontrol.component')).SuratKontrolComponent,
                data: {
                    title: 'Surat Kontrol',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Surat Kontrol"
                    ]
                },
            },
            {
                path: 'surat-rujukan-keluar',
                loadComponent: async () => (await import('./rekam-medis/surat-rujukan-keluar/surat-rujukan-keluar.component')).SuratRujukanKeluarComponent,
                data: {
                    title: 'Surat Rujukan Keluar',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Surat Rujukan Keluar"
                    ]
                },
            },
        ]
    },
]