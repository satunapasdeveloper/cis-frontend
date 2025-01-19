import { Routes } from "@angular/router";

export const orderPenunjangRoutes: Routes = [
    {
        path: 'laboratorium',
        children: [
            {
                path: 'penjadwalan',
                loadComponent: async () => (await import('./penjadwalan/penjadwalan.component')).PenjadwalanComponent,
                data: {
                    title: 'Penjadwalan Order Laboratorium',
                    breadcrumbs: [
                        "Beranda", "Laboratorium", "Penjadwalan Order Laboratorium"
                    ]
                },
            },
            {
                path: 'verifikasi',
                loadComponent: async () => (await import('./verifikasi-order/verifikasi-order.component')).VerifikasiOrderComponent,
                data: {
                    title: 'Verifikasi Order Laboratorium',
                    breadcrumbs: [
                        "Beranda", "Laboratorium", "Verifikasi Order Laboratorium"
                    ]
                },
            },
            {
                path: 'input-hasil',
                loadComponent: async () => (await import('./input-hasil-order/input-hasil-order.component')).InputHasilOrderComponent,
                data: {
                    title: 'Input Hasil Order Laboratorium',
                    breadcrumbs: [
                        "Beranda", "Laboratorium", "Input Hasil Order Laboratorium"
                    ]
                },
            },
        ]
    },
    {
        path: 'radiologi',
        children: [
            {
                path: 'penjadwalan',
                loadComponent: async () => (await import('./penjadwalan/penjadwalan.component')).PenjadwalanComponent,
                data: {
                    title: 'Penjadwalan Order Radiologi',
                    breadcrumbs: [
                        "Beranda", "Radiologi", "Penjadwalan Order Radiologi"
                    ]
                },
            },
            {
                path: 'verifikasi',
                loadComponent: async () => (await import('./verifikasi-order/verifikasi-order.component')).VerifikasiOrderComponent,
                data: {
                    title: 'Verifikasi Order Radiologi',
                    breadcrumbs: [
                        "Beranda", "Radiologi", "Verifikasi Order Radiologi"
                    ]
                },
            },
            {
                path: 'input-hasil',
                loadComponent: async () => (await import('./input-hasil-order/input-hasil-order.component')).InputHasilOrderComponent,
                data: {
                    title: 'Input Hasil Order Radiologi',
                    breadcrumbs: [
                        "Beranda", "Radiologi", "Input Hasil Order Radiologi"
                    ]
                },
            },
        ]
    }
]