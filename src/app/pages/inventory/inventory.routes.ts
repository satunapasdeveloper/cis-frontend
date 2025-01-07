import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
    {
        path: 'setup-data',
        children: [
            {
                path: 'setup-item',
                loadComponent: async () => (await import('./setup-data/setup-item/setup-item.component')).SetupItemComponent,
                data: {
                    title: 'Setup Item',
                    breadcrumbs: [
                        "Beranda", "Inventory", "Setup Data", "Setup Item"
                    ]
                }
            },
            {
                path: 'setup-group-item',
                loadComponent: async () => (await import('./setup-data/setup-group-item/setup-group-item.component')).SetupGroupItemComponent,
                data: {
                    title: 'Setup Group Item',
                    breadcrumbs: [
                        "Beranda", "Inventory", "Setup Data", "Setup Group Item"
                    ]
                }
            },
            {
                path: 'setup-jenis-item',
                loadComponent: async () => (await import('./setup-data/setup-jenis-item/setup-jenis-item.component')).SetupJenisItemComponent,
                data: {
                    title: 'Setup Jenis Item',
                    breadcrumbs: [
                        "Beranda", "Inventory", "Setup Data", "Setup Jenis Item"
                    ]
                }
            },
            {
                path: 'setup-satuan',
                loadComponent: async () => (await import('./setup-data/setup-satuan/setup-satuan.component')).SetupSatuanComponent,
                data: {
                    title: 'Setup Satuan',
                    breadcrumbs: [
                        "Beranda", "Inventory", "Setup Data", "Setup Satuan"
                    ]
                }
            },
            {
                path: 'setup-supplier',
                loadComponent: async () => (await import('./setup-data/setup-supplier/setup-supplier.component')).SetupSupplierComponent,
                data: {
                    title: 'Setup Supplier',
                    breadcrumbs: [
                        "Beranda", "Inventory", "Setup Data", "Setup Supplier"
                    ]
                }
            },
            {
                path: 'setup-stockroom',
                loadComponent: async () => (await import('./setup-data/setup-stockroom/setup-stockroom.component')).SetupStockroomComponent,
                data: {
                    title: 'Setup Stockroom',
                    breadcrumbs: [
                        "Beranda", "Inventory", "Setup Data", "Setup Stockroom"
                    ]
                }
            },
        ]
    },
]