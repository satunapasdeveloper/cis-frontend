import { Routes } from "@angular/router";

export const manajemenKasirBillingRoutes: Routes = [
    {
        path: 'setup-loket-kasir',
        loadComponent: async () => (await import('./setup-loket-kasir/setup-loket-kasir.component')).SetupLoketKasirComponent,
        data: {
            title: 'Setup Loket Kasir',
            breadcrumbs: [
                "Beranda", "Billing", "Manajemen Kasir", "Loket Kasir"
            ]
        }
    },
    {
        path: 'setting-modal-kasir',
        loadComponent: async () => (await import('./setting-modal-kasir/setting-modal-kasir.component')).SettingModalKasirComponent,
        data: {
            title: 'Setting Modal Kasir',
            breadcrumbs: [
                "Beranda", "Billing", "Manajemen Kasir", "Setting Modal Kasir"
            ]
        }
    },
    {
        path: 'tutup-kasir',
        loadComponent: async () => (await import('./tutup-kasir/tutup-kasir.component')).TutupKasirComponent,
        data: {
            title: 'Tutup Kasir',
            breadcrumbs: [
                "Beranda", "Billing", "Manajemen Kasir", "Tutup Kasir"
            ]
        }
    },
    {
        path: 'croscek-tutup-kasir',
        loadComponent: async () => (await import('./croscek-tutup-kasir/croscek-tutup-kasir.component')).CroscekTutupKasirComponent,
        data: {
            title: 'Croscek Tutup Kasir',
            breadcrumbs: [
                "Beranda", "Billing", "Manajemen Kasir", "Croscek Tutup Kasir"
            ]
        }
    }
]