import { HttpBaseResponse } from "../../http/http-request.model"

export namespace TransaksiPemasukanModel {
    export interface IPemasukan {

    }

    export class GetAll implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPemasukan[]
    }

    export interface Create {
        id_register: string
        tanggal_transaksi: string
        id_tarif_berlaku: string
        id_tarif: string
        id_dokter: string
        id_perawat: string
        id_poli: string
        qty: number
        harga: number
        diskon_dokter: number
        subtotal: number
    }

    export interface Update {
        id_transaksi: string
        id_register: string
        tanggal_transaksi: string
        id_tarif_berlaku: string
        id_tarif: string
        id_dokter: string
        id_perawat: string
        id_poli: string
        qty: number
        harga: number
        diskon_dokter: number
        subtotal: number
    }

    export interface Cancel {
        id_transaksi: string
        reason_canceled: string
    }
}