import { Routes } from "@angular/router";

export const rawatJalanRoutes: Routes = [
    {
        path: 'pelayanan',
        loadComponent: async () => (await import('./list-pendaftaran-rawat-jalan/list-pendaftaran-rawat-jalan.component')).ListPendaftaranRawatJalanComponent,
        data: {
            title: 'Pelayanan Rawat Jalan',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Rawat Jalan", "Daftar Pelayanan"
            ]
        }
    },
    {
        path: 'pendaftaran',
        loadComponent: async () => (await import('./pendaftaran-rawat-jalan/pendaftaran-rawat-jalan.component')).PendaftaranRawatJalanComponent,
        data: {
            title: 'Pendaftaran Rawat Jalan',
            breadcrumbs: [
                "Beranda", "Pelayanan", "Rawat Jalan", "Pendaftaran"
            ]
        }
    },
]