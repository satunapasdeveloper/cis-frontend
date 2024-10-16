import { Routes } from '@angular/router';

export const laporanRoutes: Routes = [
    {
        path: 'laporan-pendapatan',
        loadComponent: async () => (await import('./laporan-pendapatan/laporan-pendapatan.component')).LaporanPendapatanComponent,
        data: {
            title: 'Laporan Pendapatan',
            breadcrumbs: [
                "Beranda", "Laporan", "Laporan Pendapatan"
            ]
        },
    },
    {
        path: 'laporan-penyakit',
        loadComponent: async () => (await import('./laporan-penyakit/laporan-penyakit.component')).LaporanPenyakitComponent,
        data: {
            title: 'Laporan Penyakit',
            breadcrumbs: [
                "Beranda", "Laporan", "Laporan Penyakit"
            ]
        },
    },
    {
        path: 'laporan-kunjungan',
        loadComponent: async () => (await import('./laporan-kunjungan/laporan-kunjungan.component')).LaporanKunjunganComponent,
        data: {
            title: 'Laporan Kunjungan',
            breadcrumbs: [
                "Beranda", "Laporan", "Laporan Kunjungan"
            ]
        },
    },
    {
        path: 'laporan-kunjungan-harian',
        loadComponent: async () => (await import('./laporan-kunjungan-harian/laporan-kunjungan-harian.component')).LaporanKunjunganHarianComponent,
        data: {
            title: 'Laporan Kunjungan Harian',
            breadcrumbs: [
                "Beranda", "Laporan", "Laporan Kunjungan Harian"
            ]
        },
    },
    {
        path: 'laporan-pemakaian-obat-dan-bmhp',
        loadComponent: async () => (await import('./laporan-pemakaian-obat-dan-bmhp/laporan-pemakaian-obat-dan-bmhp.component')).LaporanPemakaianObatDanBmhpComponent,
        data: {
            title: 'Laporan Pemakaian Obat & BMHP',
            breadcrumbs: [
                "Beranda", "Laporan", "Laporan Pemakaian Obat & BMHP"
            ]
        },
    },
]