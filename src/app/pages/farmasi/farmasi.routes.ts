import { Routes } from "@angular/router";

export const farmasiRoutes: Routes = [
    {
        path: 'setup-data',
        children: [
            {
                path: 'setup-item',
                loadComponent: async () => (await import('./setup-data/setup-item/setup-item.component')).SetupItemComponent,
                data: {
                    title: 'Setup Item',
                    breadcrumbs: [
                        "Beranda", "Farmasi", "Setup Data", "Setup Item"
                    ]
                }
            },
            {
                path: 'setup-supplier',
                loadComponent: async () => (await import('./setup-data/setup-supplier/setup-supplier.component')).SetupSupplierComponent,
                data: {
                    title: 'Setup Supplier',
                    breadcrumbs: [
                        "Beranda", "Farmasi", "Setup Data", "Setup Supplier"
                    ]
                }
            },
            {
                path: 'setup-stockroom',
                loadComponent: async () => (await import('./setup-data/setup-stockroom/setup-stockroom.component')).SetupStockroomComponent,
                data: {
                    title: 'Setup Stockroom',
                    breadcrumbs: [
                        "Beranda", "Farmasi", "Setup Data", "Setup Stockroom"
                    ]
                }
            },
            {
                path: 'setup-pabrik',
                loadComponent: async () => (await import('./setup-data/setup-pabrik/setup-pabrik.component')).SetupPabrikComponent,
                data: {
                    title: 'Setup Pabrik',
                    breadcrumbs: [
                        "Beranda", "Farmasi", "Setup Data", "Setup Pabrik"
                    ]
                }
            },
            {
                path: 'setup-golongan',
                loadComponent: async () => (await import('./setup-data/setup-golongan/setup-golongan.component')).SetupGolonganComponent,
                data: {
                    title: 'Setup Golongan',
                    breadcrumbs: [
                        "Beranda", "Farmasi", "Setup Data", "Setup Golongan"
                    ]
                }
            },
        ]
    }
]