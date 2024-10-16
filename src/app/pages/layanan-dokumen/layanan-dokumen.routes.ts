import { Routes } from '@angular/router';

export const layananDokumenRoutes: Routes = [
    {
        path: 'resume-medis',
        loadComponent: async () => (await import('./resume-medis/resume-medis.component')).ResumeMedisComponent,
        data: {
            title: 'Dokumen Resume Medis',
            breadcrumbs: [
                "Beranda", "Layanan Dokumen", "Resume Medis"
            ]
        },
    },
    {
        path: 'surat-sehat',
        loadComponent: async () => (await import('./surat-sehat/surat-sehat.component')).SuratSehatComponent,
        data: {
            title: 'Surat Sehat',
            breadcrumbs: [
                "Beranda", "Layanan Dokumen", "Surat Sehat"
            ]
        },
    },
    {
        path: 'surat-sakit',
        loadComponent: async () => (await import('./surat-sakit/surat-sakit.component')).SuratSakitComponent,
        data: {
            title: 'Surat Sakit',
            breadcrumbs: [
                "Beranda", "Layanan Dokumen", "Surat Sakit"
            ]
        },
    },
    {
        path: 'invoice',
        loadComponent: async () => (await import('./invoice-rekam-medis/invoice-rekam-medis.component')).InvoiceRekamMedisComponent,
        data: {
            title: 'Invoice Rekam Medis',
            breadcrumbs: [
                "Beranda", "Layanan Dokumen", "Invoice Rekam Medis"
            ]
        },
    },
]