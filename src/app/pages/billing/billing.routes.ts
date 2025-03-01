import { Routes } from "@angular/router";

export const billingRoutes: Routes = [
    {
        path: 'setup-data',
        loadChildren: async () => (await import('./setup-data/setup-data.routes')).setupDataBillingRoutes
    },
    {
        path: 'manajemen-kasir',
        loadChildren: async () => (await import('./manajemen-kasir/manajemen-kasir.routes')).manajemenKasirBillingRoutes
    },
    {
        path: 'invoice-pasien',
        loadComponent: async () => (await import('./list-invoice-pasien/list-invoice-pasien.component')).ListInvoicePasienComponent,
        data: {
            title: 'Daftar Tagihan Pasien',
            breadcrumbs: [
                "Beranda", "Billing", "Daftar Tagihan Pasien"
            ]
        }
    },
    {
        path: 'payment-invoice',
        loadComponent: async () => (await import('./input-billing-pasien/input-billing-pasien.component')).InputBillingPasienComponent,
        data: {
            title: 'Pembayaran Tagihan',
            breadcrumbs: [
                "Beranda", "Billing", "Pembayaran Tagihan"
            ]
        }
    },
]