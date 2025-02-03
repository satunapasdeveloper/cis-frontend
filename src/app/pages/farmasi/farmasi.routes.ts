import { Routes } from "@angular/router";

export const farmasiRoutes: Routes = [
    {
        path: 'setup-data',
        children: [
            {
                path: 'setup-rute-pemberian-obat',
                loadComponent: async () => (await import('./setup-data/setup-rute-pemberian-obat/setup-rute-pemberian-obat.component')).SetupRutePemberianObatComponent,
                data: {
                    title: 'Setup Rute Pemberian Obat',
                    breadcrumbs: [
                        "Beranda", "Farmasi", "Setup Data", "Setup Rute Pemberian Obat"
                    ]
                }
            },
        ]
    },
    {
        path: 'antrian',
        loadComponent: async () => (await import('./antrian-farmasi/antrian-farmasi.component')).AntrianFarmasiComponent,
        data: {
            title: 'Antrian Farmasi',
            breadcrumbs: [
                "Beranda", "Farmasi", "Antrian Farmasi"
            ]
        }
    },
    {
        path: 'loket-farmasi',
        loadComponent: async () => (await import('./loket-farmasi/loket-farmasi.component')).LoketFarmasiComponent,
        data: {
            title: 'Loket Farmasi',
            breadcrumbs: [
                "Beranda", "Farmasi", "Loket"
            ]
        }
    },
    {
        path: 'siapkan-resep',
        loadComponent: async () => (await import('./siapkan-resep/siapkan-resep.component')).SiapkanResepComponent,
        data: {
            title: 'Siapkan Resep',
            breadcrumbs: [
                "Beranda", "Farmasi", "Siapkan Resep"
            ]
        }
    },
    {
        path: 'telaah-resep',
        loadComponent: async () => (await import('./telaah-resep/telaah-resep.component')).TelaahResepComponent,
        data: {
            title: 'Telaah Resep',
            breadcrumbs: [
                "Beranda", "Farmasi", "Telaah Resep"
            ]
        }
    },
    {
        path: 'penyerahan-resep',
        loadComponent: async () => (await import('./penyerahan-resep/penyerahan-resep.component')).PenyerahanResepComponent,
        data: {
            title: 'Penyerahan Resep',
            breadcrumbs: [
                "Beranda", "Farmasi", "Penyerahan Resep"
            ]
        }
    },
    {
        path: 'penjualan-obat',
        children: [
            {
                path: 'history',
                loadComponent: async () => (await import('./penjualan-obat/history-penjualan-obat/history-penjualan-obat.component')).HistoryPenjualanObatComponent,
                data: {
                    title: 'History Penjualan Obat',
                    breadcrumbs: [
                        "Beranda", "Farmasi", "History Penjualan Obat"
                    ]
                }
            },
        ]
    },
]