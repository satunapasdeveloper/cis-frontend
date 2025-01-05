import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace SatuanModel {
    export interface ISatuan {
        id_satuan: number
        kode_satuan: string
        nama_satuan: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface ISatuanQueryParams {
        page: number;
        count: number;
        nama_satuan?: string
    }

    export class GetAllSatuan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: ISatuan[];
            totalRows: number;
        }
    }

    export class GetByIdSatuan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISatuan
    }

    export interface CreateSatuan {
        kode_satuan: string
        nama_satuan: string
    }

    export interface UpdateSatuan {
        id_satuan: number
        kode_satuan: string
        nama_satuan: string
        is_active: boolean
    }
}