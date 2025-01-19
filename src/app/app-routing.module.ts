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
        path: 'pendaftaran',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/pendaftaran/pendaftaran.routes')).pendaftaranRoutes
    },
    {
        path: 'pelayanan-klinik',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/pelayanan-klinik/pelayanan-klinik.routes')).pelayananRoutes
    },
    {
        path: 'billing',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/billing/billing.routes')).billingRoutes
    },
    {
        path: 'farmasi',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/farmasi/farmasi.routes')).farmasiRoutes
    },
    {
        path: 'inventory',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/inventory/inventory.routes')).inventoryRoutes
    },
    {
        path: 'order-penunjang',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/order-penunjang/order-penunjang.routes')).orderPenunjangRoutes
    },
    {
        path: 'layanan-dokumen',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/layanan-dokumen/layanan-dokumen.routes')).layananDokumenRoutes
    },
    {
        path: 'laporan',
        canActivate: [AuthGuard],
        loadChildren: async () => (await import('./pages/laporan/laporan.routes')).laporanRoutes
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
    imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
