import { HttpBaseResponse } from "../../http/http-request.model"

export namespace PenjaminModel {
    export interface IPenjamin {
        id_penjamin: string
        nama_penjamin: string
        is_active: boolean
    }

    export interface IPenjaminQueryParams {
        page: number;
        count: number;
        nama_penjamin?: string;
    }

    export class GetAllPenjamin implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IPenjamin[];
            totalRows: number;
        }
    }

    export class GetByIdPenjamin implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPenjamin
    }

    export interface CreatePenjamin {
        nama_penjamin: string
    }

    export interface UpdatePenjamin {
        id_penjamin: string
        nama_penjamin: string
        is_active: boolean
    }
}