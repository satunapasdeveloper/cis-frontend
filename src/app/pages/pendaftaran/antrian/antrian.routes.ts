import { Routes } from "@angular/router";

export const antrianPendaftaranRoutes: Routes = [
    {
        path: 'setup-loket',
        loadComponent: async () => (await import('./setup-loket/setup-loket.component')).SetupLoketComponent,
        data: {
            title: 'Setup Loket',
            breadcrumbs: [
                "Beranda", "Pendafaran", "Antrian", "Setup Loket"
            ]
        }
    }
]