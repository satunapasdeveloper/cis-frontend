export namespace ResepModel {
    export interface IResep {
        id_pendaftaran: number
        obat: IObat[]
        racikan: IRacikan[]
        manual: IManual[]
    }

    export interface IObat {
        id_item: number
        nama_obat: string
        qty: number
        harga: number
        subtotal: number
        aturan_pakai: string
        waktu: string
        waktu_spesifik: string
        rute_pemberian: string
    }

    export interface IRacikan {
        nama_obat: string
        qty: number
        aturan_pakai: string
        waktu: string
        waktu_spesifik: string
        rute_pemberian: string
        racikan: IDetailRacikan[]
    }

    export interface IDetailRacikan {
        id_item: number
        nama_obat: string
        qty: number
        harga: number
        subtotal: number
    }

    export interface IManual {
        nama_obat: string
        qty: number
        aturan_pakai: string
        waktu: string
        waktu_spesifik: string
        rute_pemberian: string
    }
}