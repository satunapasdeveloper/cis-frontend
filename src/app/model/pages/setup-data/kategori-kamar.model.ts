import { HttpBaseResponse } from "../../http/http-request.model"

export namespace KategoriKamarModel {
    export interface IKategoriKamar {
        id_bed_kategori: string
        nama_kategori: string
        is_active: boolean
    }

    export interface IKategoriKamarQueryParams {
        page: number;
        count: number;
        nama_kategori?: string;
    }

    export class GetAllKategoriKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IKategoriKamar[];
            totalRows: number;
        }
    }

    export class GetByIdKategoriKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKategoriKamar
    }

    export interface CreateKategoriKamar {
        nama_kategori: string
        is_active: boolean
    }

    export interface UpdateKategoriKamar {
        id_bed_kategori: string
        nama_kategori: string
        is_active: boolean
    }
}