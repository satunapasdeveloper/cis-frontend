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
                path: 'assesment-awal',
                loadComponent: async () => (await import('./rekam-medis/input-rekam-medis/pemeriksaan-fisik/pemeriksaan-fisik.component')).PemeriksaanFisikComponent,
                data: {
                    title: 'Assesment Awal',
                    breadcrumbs: [
                        "Beranda", "Pelayanan", "Rekam Medis", "Assesment Awal"
                    ]
                },
            }
        ]
    },
]