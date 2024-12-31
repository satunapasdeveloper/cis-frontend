import { Routes } from "@angular/router";

export const billingRoutes: Routes = [
    {
        path: 'setup-data',
        loadChildren: async () => (await import('./setup-data/setup-data.routes')).setupDataBillingRoutes
    }
]