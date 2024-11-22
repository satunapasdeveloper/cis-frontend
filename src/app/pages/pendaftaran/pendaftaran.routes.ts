import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/middleware/auth.guard';

export const pendaftaranRoutes: Routes = [
    {
        path: 'setup-data',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'setup-kelas',
                canActivate: [AuthGuard],
                loadComponent: async () => (await import('./setup-data/setup-kelas/setup-kelas.component')).SetupKelasComponent,
                data: {
                    title: 'Setup Kelas',
                    breadcrumbs: [
                        "Beranda", "Pendafaran", "Setup Data", "Setup Kelas"
                    ]
                }
            },
            {
                path: 'setup-unit',
                canActivate: [AuthGuard],
                loadComponent: async () => (await import('./setup-data/setup-unit/setup-unit.component')).SetupUnitComponent,
                data: {
                    title: 'Setup Unit',
                    breadcrumbs: [
                        "Beranda", "Pendafaran", "Setup Data", "Setup Unit"
                    ]
                }
            },
            {
                path: 'setup-kategori-kamar',
                canActivate: [AuthGuard],
                loadComponent: async () => (await import('./setup-data/setup-unit/setup-unit.component')).SetupUnitComponent,
                data: {
                    title: 'Setup Unit',
                    breadcrumbs: [
                        "Beranda", "Pendafaran", "Setup Data", "Setup Unit"
                    ]
                }
            },
        ]
    },
    {
        path: 'pasien',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pasien/pasien.component')).PasienComponent,
        data: {
            title: 'Pasien',
            breadcrumbs: [
                "Beranda", "Pendafaran", "Pasien"
            ]
        }
    },
    {
        path: 'antrian',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./antrian/antrian.component')).AntrianComponent,
        data: {
            title: 'Antrian',
            breadcrumbs: [
                "Beranda", "Pendaftaran", "Antrian"
            ]
        },
    },
    {
        path: 'antrian/tambah',
        loadComponent: async () => (await import('./antrian/tambah-antrian/tambah-antrian.component')).TambahAntrianComponent,
        data: {
            title: 'Buat Antrian Baru',
            breadcrumbs: [
                "Beranda", "Pendaftaran", "Antrian", "Buat Antrian Baru"
            ]
        },
    },
    {
        path: 'antrian/assesment-awal',
        loadComponent: async () => (await import('./assesment-awal/assesment-awal.component')).AssesmentAwalComponent,
        data: {
            title: 'Buat Assesment Awal',
            breadcrumbs: [
                "Beranda", "Pendaftaran", "Antrian", "Buat Assesment Awal"
            ]
        },
    },
]