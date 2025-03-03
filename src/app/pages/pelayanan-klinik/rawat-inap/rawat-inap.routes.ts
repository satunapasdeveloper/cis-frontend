import { Routes } from '@angular/router';

export const rawatInapRoutes: Routes = [
    {
        path: 'pelayanan',
        loadComponent: async () => (await import('./list-pendaftaran-rawat-inap/list-pendaftaran-rawat-inap.component')).ListPendaftaranRawatInapComponent,
        data: {
            title: 'Pelayanan Rawat Inap',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Rawat Inap", "Daftar Pelayanan"
            ]
        }
    },
    {
        path: 'pendaftaran',
        loadComponent: async () => (await import('./pendaftaran-rawat-inap/pendaftaran-rawat-inap.component')).PendaftaranRawatInapComponent,
        data: {
            title: 'Pendaftaran Rawat Inap',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Rawat Inap", "Pendaftaran"
            ]
        }
    },
    {
        path: 'spri',
        loadComponent: async () => (await import('./surat-perintah-rawat-inap/surat-perintah-rawat-inap.component')).SuratPerintahRawatInapComponent,
        data: {
            title: 'Surat Perintah Rawat Inap',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Rawat Inap", "SPRI"
            ]
        }
    },
    {
        path: 'permintaan-operasi',
        loadComponent: async () => (await import('./permintaan-operasi/permintaan-operasi.component')).PermintaanOperasiComponent,
        data: {
            title: 'Permintaan Operasi',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Rawat Inap", "Permintaan Operasi"
            ]
        }
    },
    {
        path: 'transfer-tempat-tidur',
        loadComponent: async () => (await import('./transfer-tempat-tidur/transfer-tempat-tidur.component')).TransferTempatTidurComponent,
        data: {
            title: 'Transfer Tempat Tidur',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Rawat Inap", "Transfer Tempat Tidur"
            ]
        }
    },
]