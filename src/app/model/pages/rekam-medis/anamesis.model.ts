export namespace AnamesisModel {
    export interface IAnamnesis {
        id_pendaftaran: string
        keluhan_utama: string
        riwayat_penyakit: string
        riwayat_penyakit_terdahulu: string
        riwayat_alergi: string
        riwayat_pengobatan: string
    }

    export interface CreateAnamesis {
        id_pendaftaran: number
        keluhan_utama: string
        riwayat_penyakit: string
        riwayat_penyakit_terdahulu: string
        riwayat_alergi: string
        riwayat_pengobatan: string
    }
}