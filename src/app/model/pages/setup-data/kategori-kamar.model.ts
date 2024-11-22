import { HttpBaseResponse } from "../../http/http-request.model"

export namespace KategoriKamarModel {
    export interface IKategoriKamar {
        id_kategori: string
        kategori: string
        status_aktif: boolean
    }

    export class GetAllKategoriKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKategoriKamar[]
    }

    export class GetByIdKategoriKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKategoriKamar
    }

    export interface CreateKategoriKamar {
        kategori: string
        status_aktif: boolean
    }

    export interface UpdateKategoriKamar {
        id_kategori: string
        kategori: string
        status_aktif: boolean
    }
}