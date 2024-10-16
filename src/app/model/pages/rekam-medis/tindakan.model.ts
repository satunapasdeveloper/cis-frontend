import { HttpBaseResponse } from "../../http/http-request.model"

export namespace TindakanModel {
    export interface ITindakan {
        id_pendaftaran: string
        kie: IKie
        tindakan: ITindakanDetail[]
        bmhp: IBmhp[]
        tanggal: string
        waktu: string
        id_user: number
    }

    export interface IKie {
        catatan: string
    }

    export interface ITindakanDetail {
        kode_icd9: string
        display_icd9: string
        id_tindakan: string
        tindakan: string
        qty: number
        harga: number
        total: number
    }

    export interface IBmhp {
        kode_kfa: string
        id_item: number
        nama_item: string
        qty: number
        harga: number
        total: number
    }

    export interface IItemBmhp {
        id_item: string
        uuid: string
        kategori: string
        nama_item: string
        kode_kfa: string
        satuan: string
        harga_jual: string
        is_active: boolean
        is_delete: boolean
    }

    export class GetItemBmhp implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IItemBmhp[]
    }
}