import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './middleware/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./pages/authentication/authentication.component')).AuthenticationComponent,
        data: {
            title: 'Sign In'
        }
    },
    {
        path: 'beranda',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/beranda/beranda.component')).BerandaComponent,
        data: {
            title: 'Beranda',
            breadcrumbs: ['Beranda']
        }
    },
    {
        path: 'setup-data',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/setup-data/setup-data.routes')).setupDataRoutes
    },
    {
        path: 'pasien',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/pasien/pasien.component')).PasienComponent,
        data: {
            title: 'Pasien',
            breadcrumbs: [
                "Beranda", "Pasien"
            ]
        }
    },
    {
        path: 'dokter',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/dokter/dokter.component')).DokterComponent,
        data: {
            title: 'Dokter',
            breadcrumbs: [
                "Beranda", "Dokter"
            ]
        }
    },
    {
        path: 'antrian',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./pages/antrian/antrian.component')).AntrianComponent,
        data: {
            title: 'Antrian',
            breadcrumbs: [
                "Beranda", "Antrian"
            ]
        },
    },
    {
        path: 'antrian/tambah',
        loadComponent: async () => (await import('./pages/antrian/tambah-antrian/tambah-antrian.component')).TambahAntrianComponent,
        data: {
            title: 'Buat Antrian Baru',
            breadcrumbs: [
                "Beranda", "Antrian", "Buat Antrian Baru"
            ]
        },
    },
    {
        path: 'antrian/assesment-awal',
        loadComponent: async () => (await import('./pages/assesment-awal/assesment-awal.component')).AssesmentAwalComponent,
        data: {
            title: 'Buat Assesment Awal',
            breadcrumbs: [
                "Beranda", "Antrian", "Buat Assesment Awal"
            ]
        },
    },
    {
        path: 'rekam-medis',
        children: [
            {
                path: 'data',
                loadComponent: async () => (await import('./pages/rekam-medis/history-rekam-medis/history-rekam-medis.component')).HistoryRekamMedisComponent,
                data: {
                    title: 'Data Rekam Medis',
                    breadcrumbs: [
                        "Beranda", "Rekam Medis", "Data Rekam Medis"
                    ]
                },
            },
            {
                path: 'baru',
                loadComponent: async () => (await import('./pages/rekam-medis/input-rekam-medis/input-rekam-medis.component')).InputRekamMedisComponent,
                data: {
                    title: 'Buat Rekam Medis',
                    breadcrumbs: [
                        "Beranda", "Rekam Medis", "Buat Rekam Medis"
                    ]
                },
            }
        ]
    },
    {
        path: 'layanan-dokumen',
        children: [
            {
                path: 'resume-medis',
                loadComponent: async () => (await import('./pages/layanan-dokumen/resume-medis/resume-medis.component')).ResumeMedisComponent,
                data: {
                    title: 'Dokumen Resume Medis',
                    breadcrumbs: [
                        "Beranda", "Layanan Dokumen", "Resume Medis"
                    ]
                },
            },
            {
                path: 'surat-sehat',
                loadComponent: async () => (await import('./pages/layanan-dokumen/surat-sehat/surat-sehat.component')).SuratSehatComponent,
                data: {
                    title: 'Surat Sehat',
                    breadcrumbs: [
                        "Beranda", "Layanan Dokumen", "Surat Sehat"
                    ]
                },
            },
            {
                path: 'surat-sakit',
                loadComponent: async () => (await import('./pages/layanan-dokumen/surat-sakit/surat-sakit.component')).SuratSakitComponent,
                data: {
                    title: 'Surat Sakit',
                    breadcrumbs: [
                        "Beranda", "Layanan Dokumen", "Surat Sakit"
                    ]
                },
            },
            {
                path: 'invoice',
                loadComponent: async () => (await import('./pages/layanan-dokumen/invoice-rekam-medis/invoice-rekam-medis.component')).InvoiceRekamMedisComponent,
                data: {
                    title: 'Invoice Rekam Medis',
                    breadcrumbs: [
                        "Beranda", "Layanan Dokumen", "Invoice Rekam Medis"
                    ]
                },
            },
        ]
    },
    {
        path: 'laporan',
        children: [
            {
                path: 'laporan-pendapatan',
                loadComponent: async () => (await import('./pages/laporan/laporan-pendapatan/laporan-pendapatan.component')).LaporanPendapatanComponent,
                data: {
                    title: 'Laporan Pendapatan',
                    breadcrumbs: [
                        "Beranda", "Laporan", "Laporan Pendapatan"
                    ]
                },
            },
            {
                path: 'laporan-penyakit',
                loadComponent: async () => (await import('./pages/laporan/laporan-penyakit/laporan-penyakit.component')).LaporanPenyakitComponent,
                data: {
                    title: 'Laporan Penyakit',
                    breadcrumbs: [
                        "Beranda", "Laporan", "Laporan Penyakit"
                    ]
                },
            },
            {
                path: 'laporan-kunjungan',
                loadComponent: async () => (await import('./pages/laporan/laporan-kunjungan/laporan-kunjungan.component')).LaporanKunjunganComponent,
                data: {
                    title: 'Laporan Kunjungan',
                    breadcrumbs: [
                        "Beranda", "Laporan", "Laporan Kunjungan"
                    ]
                },
            },
            {
                path: 'laporan-kunjungan-harian',
                loadComponent: async () => (await import('./pages/laporan/laporan-kunjungan-harian/laporan-kunjungan-harian.component')).LaporanKunjunganHarianComponent,
                data: {
                    title: 'Laporan Kunjungan Harian',
                    breadcrumbs: [
                        "Beranda", "Laporan", "Laporan Kunjungan Harian"
                    ]
                },
            },
            {
                path: 'laporan-pemakaian-obat-dan-bmhp',
                loadComponent: async () => (await import('./pages/laporan/laporan-pemakaian-obat-dan-bmhp/laporan-pemakaian-obat-dan-bmhp.component')).LaporanPemakaianObatDanBmhpComponent,
                data: {
                    title: 'Laporan Pemakaian Obat & BMHP',
                    breadcrumbs: [
                        "Beranda", "Laporan", "Laporan Pemakaian Obat & BMHP"
                    ]
                },
            },
        ]
    },
    {
        path: '**',
        loadComponent: async () => (await import('./pages/wildcard-not-found/wildcard-not-found.component')).WildcardNotFoundComponent,
        data: {
            title: 'Oops'
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
