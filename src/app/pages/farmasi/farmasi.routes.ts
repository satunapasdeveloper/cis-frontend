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
    },
    {
        path: 'purchasing',
        children: [
            {
                path: 'pemesanan-po',
                children: [
                    {
                        path: 'history',
                        loadComponent: async () => (await import('./purchasing/pemesanan-po/history-pemesanan-po/history-pemesanan-po.component')).HistoryPemesananPoComponent,
                        data: {
                            title: 'History Pemesanan PO',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Pemesanan PO", "History"
                            ]
                        }
                    },
                    {
                        path: 'input',
                        loadComponent: async () => (await import('./purchasing/pemesanan-po/input-pemesanan-po/input-pemesanan-po.component')).InputPemesananPoComponent,
                        data: {
                            title: 'Input Pemesanan PO',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Pemesanan PO", "Tambah"
                            ]
                        }
                    },
                    {
                        path: 'detail/:id',
                        loadComponent: async () => (await import('./purchasing/pemesanan-po/detail-pemesanan-po/detail-pemesanan-po.component')).DetailPemesananPoComponent,
                        data: {
                            title: 'Detail Pemesanan PO',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Pemesanan PO", "Detail"
                            ]
                        }
                    },
                ]
            },
            {
                path: 'penerimaan-barang',
                children: [
                    {
                        path: 'history',
                        loadComponent: async () => (await import('./purchasing/penerimaan-barang/history-penerimaan-barang/history-penerimaan-barang.component')).HistoryPenerimaanBarangComponent,
                        data: {
                            title: 'History Penerimaan Barang',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Penerimaan Barang", "History"
                            ]
                        }
                    },
                    {
                        path: 'input',
                        loadComponent: async () => (await import('./purchasing/penerimaan-barang/input-penerimaan-barang/input-penerimaan-barang.component')).InputPenerimaanBarangComponent,
                        data: {
                            title: 'Input Penerimaan Barang',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Penerimaan Barang", "Tambah"
                            ]
                        }
                    },
                    {
                        path: 'detail/:id',
                        loadComponent: async () => (await import('./purchasing/penerimaan-barang/detail-penerimaan-barang/detail-penerimaan-barang.component')).DetailPenerimaanBarangComponent,
                        data: {
                            title: 'Detail Penerimaan Barang',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Penerimaan Barang", "Detail"
                            ]
                        }
                    },
                ]
            },
            {
                path: 'retur-pembelian',
                children: [
                    {
                        path: 'history',
                        loadComponent: async () => (await import('./purchasing/retur-pembelian/history-retur-pembelian/history-retur-pembelian.component')).HistoryReturPembelianComponent,
                        data: {
                            title: 'History Retur Pembelian',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Retur Pembelian", "History"
                            ]
                        }
                    },
                    {
                        path: 'input',
                        loadComponent: async () => (await import('./purchasing/retur-pembelian/input-retur-pembelian/input-retur-pembelian.component')).InputReturPembelianComponent,
                        data: {
                            title: 'Input Retur Pembelian',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Retur Pembelian", "Tambah"
                            ]
                        }
                    },
                    {
                        path: 'detail/:id',
                        loadComponent: async () => (await import('./purchasing/retur-pembelian/detail-retur-pembelian/detail-retur-pembelian.component')).DetailReturPembelianComponent,
                        data: {
                            title: 'Detail Retur Pembelian',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Retur Pembelian", "Detail"
                            ]
                        }
                    },
                ]
            },
            {
                path: 'penerimaan-konsinyasi',
                children: [
                    {
                        path: 'history',
                        loadComponent: async () => (await import('./purchasing/penerimaan-konsinyasi/history-penerimaan-konsinyasi/history-penerimaan-konsinyasi.component')).HistoryPenerimaanKonsinyasiComponent,
                        data: {
                            title: 'History Penerimaan Konsinyasi',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Penerimaan Konsinyasi", "History"
                            ]
                        }
                    },
                    {
                        path: 'input',
                        loadComponent: async () => (await import('./purchasing/penerimaan-konsinyasi/input-penerimaan-konsinyasi/input-penerimaan-konsinyasi.component')).InputPenerimaanKonsinyasiComponent,
                        data: {
                            title: 'Input Penerimaan Konsinyasi',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Penerimaan Konsinyasi", "Tambah"
                            ]
                        }
                    },
                    {
                        path: 'detail/:id',
                        loadComponent: async () => (await import('./purchasing/penerimaan-konsinyasi/detail-penerimaan-konsinyasi/detail-penerimaan-konsinyasi.component')).DetailPenerimaanKonsinyasiComponent,
                        data: {
                            title: 'Detail Penerimaan Konsinyasi',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Penerimaan Konsinyasi", "Detail"
                            ]
                        }
                    },
                ]
            },
            {
                path: 'retur-konsinyasi',
                children: [
                    {
                        path: 'history',
                        loadComponent: async () => (await import('./purchasing/retur-konsinyasi/history-retur-konsinyasi/history-retur-konsinyasi.component')).HistoryReturKonsinyasiComponent,
                        data: {
                            title: 'History Retur Konsinyasi',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Retur Konsinyasi", "History"
                            ]
                        }
                    },
                    {
                        path: 'input',
                        loadComponent: async () => (await import('./purchasing/retur-konsinyasi/input-retur-konsinyasi/input-retur-konsinyasi.component')).InputReturKonsinyasiComponent,
                        data: {
                            title: 'Input Retur Konsinyasi',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Retur Konsinyasi", "Tambah"
                            ]
                        }
                    },
                    {
                        path: 'detail/:id',
                        loadComponent: async () => (await import('./purchasing/retur-konsinyasi/detail-retur-konsinyasi/detail-retur-konsinyasi.component')).DetailReturKonsinyasiComponent,
                        data: {
                            title: 'Detail Retur Konsinyasi',
                            breadcrumbs: [
                                "Beranda", "Farmasi", "Purchasing", "Retur Konsinyasi", "Detail"
                            ]
                        }
                    },
                ]
            },
        ]
    }
]