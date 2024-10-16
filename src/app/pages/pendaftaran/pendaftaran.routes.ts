import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/middleware/auth.guard';

export const pendaftaranRoutes: Routes = [
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