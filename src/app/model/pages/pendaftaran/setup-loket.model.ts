import { HttpBaseResponse } from "../../http/http-request.model"

export namespace LoketModel {
    export interface ILoket {
        id_loket: number
        nama_loket: string
        id_antrian_jenis: number
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface ILoketQueryParams {
        page: number;
        count: number;
        nama_loket?: string;
    }

    export class GetAllLoket implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: ILoket[];
            totalRows: number;
        }
    }

    export class GetByIdLoket implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ILoket
    }

    export interface CreateLoket {
        nama_loket: string
        id_antrian_jenis: string
    }

    export interface UpdateLoket {
        id_loket: number
        nama_loket: string
        id_antrian_jenis: number
        is_active: boolean
    }
}