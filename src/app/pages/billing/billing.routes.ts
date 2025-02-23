import { Routes } from "@angular/router";

export const billingRoutes: Routes = [
    {
        path: 'setup-data',
        loadChildren: async () => (await import('./setup-data/setup-data.routes')).setupDataBillingRoutes
    },
    {
        path: 'manajemen-kasir',
        loadChildren: async () => (await import('./manajemen-kasir/manajemen-kasir.routes')).manajemenKasirBillingRoutes
    }
]