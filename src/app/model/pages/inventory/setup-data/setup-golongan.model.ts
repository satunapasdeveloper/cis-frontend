import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace GolonganModel {
    export interface IGolongan {
        id_golongan: string
        kode_golongan: string
        nama_golongan: string
        is_active: boolean
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
    }

    export interface IQueryString {
        page: number;
        count: number;
        kode_golongan?: string;
        nama_golongan?: string;
    }

    export class GetAllGolongan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IGolongan[];
            totalRows: number;
        }
    }

    export class GetByIdGolongan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IGolongan
    }

    export interface CreateGolongan {
        kode_golongan: string
        nama_golongan: string
    }

    export interface UpdateGolongan {
        id_golongan: string
        kode_golongan: string
        nama_golongan: string
    }
}