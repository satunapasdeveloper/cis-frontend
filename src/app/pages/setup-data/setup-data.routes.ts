import { Route } from "@angular/router";

export const setupDataRoutes: Route[] = [
    {
        path: 'setup-poli',
        loadComponent: async () => (await import('./setup-poli/setup-poli.component')).SetupPoliComponent,
        data: {
            title: 'Setup Poli',
            breadcrumbs: [
                "Beranda", "Setup Data", "Setup Poli"
            ]
        }
    },
    {
        path: 'setup-item',
        loadComponent: async () => (await import('./setup-item/setup-item.component')).SetupItemComponent,
        data: {
            title: 'Setup Item',
            breadcrumbs: [
                "Beranda", "Setup Data", "Setup Item"
            ]
        }
    },
    {
        path: 'setup-tindakan-medis',
        loadComponent: async () => (await import('./setup-tindakan-medis/setup-tindakan-medis.component')).SetupTindakanMedisComponent,
        data: {
            title: 'Setup Tindakan Medis',
            breadcrumbs: [
                "Beranda", "Setup Data", "Setup Tindakan Medis"
            ]
        }
    },
    {
        path: 'setup-rekanan-penunjang',
        loadComponent: async () => (await import('./setup-rekanan-penunjang/setup-rekanan-penunjang.component')).SetupRekananPenunjangComponent,
        data: {
            title: 'Setup Rekanan Penunjang',
            breadcrumbs: [
                "Beranda", "Setup Data", "Setup Rekanan Penunjang"
            ]
        }
    },
    {
        path: 'manajemen-user',
        loadComponent: async () => (await import('./manajemen-user/manajemen-user.component')).ManajemenUserComponent,
        data: {
            title: 'Manajemen User',
            breadcrumbs: [
                "Beranda", "Setup Data", "Manajemen User"
            ]
        }
    }
];
