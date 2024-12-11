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
                path: 'data',
                loadComponent: async () => (await import('./rekam-medis/history-rekam-medis/history-rekam-medis.component')).HistoryRekamMedisComponent,
                data: {
                    title: 'Data Rekam Medis',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Data Rekam Medis"
                    ]
                },
            },
            {
                path: 'baru',
                loadComponent: async () => (await import('./rekam-medis/input-rekam-medis/input-rekam-medis.component')).InputRekamMedisComponent,
                data: {
                    title: 'Buat Rekam Medis',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Buat Rekam Medis"
                    ]
                },
            }
        ]
    },
]