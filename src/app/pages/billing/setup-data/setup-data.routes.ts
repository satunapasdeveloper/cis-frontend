import { Routes } from "@angular/router";

export const setupDataBillingRoutes: Routes = [
    {
        path: 'setup-kelompok-tarif',
        loadComponent: async () => (await import('./setup-kelompok-tarif/setup-kelompok-tarif.component')).SetupKelompokTarifComponent,
        data: {
            title: 'Setup Kelompok Tarif',
            breadcrumbs: [
                "Beranda", "Billing", "Setup Data", "Setup Kelompok Tarif"
            ]
        }
    },
    {
        path: 'setup-tarif',
        loadComponent: async () => (await import('./setup-tarif/setup-tarif.component')).SetupTarifComponent,
        data: {
            title: 'Setup Tarif',
            breadcrumbs: [
                "Beranda", "Billing", "Setup Data", "Setup Tarif"
            ]
        }
    }
]