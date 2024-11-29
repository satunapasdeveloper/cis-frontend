import { Route } from "@angular/router";
import { AuthGuard } from "src/app/middleware/auth.guard";

export const setupDataRoutes: Route[] = [
    {
        path: 'setup-kategori-kamar',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./setup-kategori-kamar/setup-kategori-kamar.component')).SetupKategoriKamarComponent,
        data: {
            title: 'Setup Kategori Kamar',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Kategori Kamar"
            ]
        }
    },
    {
        path: 'setup-kamar',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./setup-kamar/setup-kamar.component')).SetupKamarComponent,
        data: {
            title: 'Setup Kamar',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Kamar"
            ]
        }
    },
    {
        path: 'setup-bed',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./setup-bed/setup-bed.component')).SetupBedComponent,
        data: {
            title: 'Setup Bed',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Bed"
            ]
        }
    },
    {
        path: 'setup-poli',
        loadComponent: async () => (await import('./setup-poli/setup-poli.component')).SetupPoliComponent,
        data: {
            title: 'Setup Poli',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Poli"
            ]
        }
    },
    {
        path: 'setup-penjamin',
        loadComponent: async () => (await import('./setup-penjamin/setup-penjamin.component')).SetupPenjaminComponent,
        data: {
            title: 'Setup Penjamin',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Penjamin"
            ]
        }
    },
    {
        path: 'setup-jabatan',
        loadComponent: async () => (await import('./setup-jabatan/setup-jabatan.component')).SetupJabatanComponent,
        data: {
            title: 'Setup Jabatan',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Jabatan"
            ]
        }
    },
    {
        path: 'setup-role',
        loadComponent: async () => (await import('./setup-role/setup-role.component')).SetupRoleComponent,
        data: {
            title: 'Setup Role',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Role"
            ]
        }
    },
    {
        path: 'setup-menu',
        loadComponent: async () => (await import('./setup-menu/setup-menu.component')).SetupMenuComponent,
        data: {
            title: 'Setup Menu',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Menu"
            ]
        }
    },
    {
        path: 'setting-role-menu',
        loadComponent: async () => (await import('./setting-role-menu/setting-role-menu.component')).SettingRoleMenuComponent,
        data: {
            title: 'Setting Role Menu',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setting Role"
            ]
        }
    },
    {
        path: 'setup-nakes',
        loadComponent: async () => (await import('./setup-nakes/setup-nakes.component')).SetupNakesComponent,
        data: {
            title: 'Setup Nakes',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Nakes"
            ]
        }
    },
    {
        path: 'setup-tindakan-medis',
        loadComponent: async () => (await import('./setup-tindakan-medis/setup-tindakan-medis.component')).SetupTindakanMedisComponent,
        data: {
            title: 'Setup Tindakan Medis',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Tindakan Medis"
            ]
        }
    },
    {
        path: 'setup-rekanan-penunjang',
        loadComponent: async () => (await import('./setup-rekanan-penunjang/setup-rekanan-penunjang.component')).SetupRekananPenunjangComponent,
        data: {
            title: 'Setup Rekanan Penunjang',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Setup Rekanan Penunjang"
            ]
        }
    },
    {
        path: 'manajemen-user',
        loadComponent: async () => (await import('./manajemen-user/manajemen-user.component')).ManajemenUserComponent,
        data: {
            title: 'Manajemen User',
            breadcrumbs: [
                "Beranda", "Pelayanan Klinik", "Setup Data", "Manajemen User"
            ]
        }
    }
];
