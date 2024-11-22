import { HttpBaseResponse } from "../../http/http-request.model"

export namespace KamarModel {
    export interface IKamar {
        id_kamar: string
        id_kategori: string
        kategori: string
        no_kamar: string
        label_kamar: string
        no_lantai: string
        id_poli: string
        poli: string
        id_kelas: string
        nama_kelas: string
        gender: string
        keterangan: string
        isolasi: boolean
        status_aktif: boolean
    }

    export class GetAllKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKamar[]
    }

    export class GetByIdKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKamar
    }

    export interface CreateKamar {
        id_kategori: string
        no_kamar: string
        label_kamar: string
        no_lantai: string
        id_poli: string
        id_kelas: string
        gender: string
        keterangan: string
        isolasi: boolean
        status_aktif: boolean
    }

    export interface UpdateKamar {
        id_kamar: string
        id_kategori: string
        no_kamar: string
        label_kamar: string
        no_lantai: string
        id_poli: string
        id_kelas: string
        gender: string
        keterangan: string
        isolasi: boolean
        status_aktif: boolean
    }
}