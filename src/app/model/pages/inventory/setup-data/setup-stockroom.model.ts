import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace StockroomModel {
    export interface IStockroom {
        id_stokroom: string
        kode_stokroom: string
        nama_stokroom: string
        is_active: boolean
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
    }

    export interface IQueryString {
        page: number;
        count: number;
        kode_stokroom?: string;
        nama_stokroom?: string;
    }

    export class GetAllStockroom implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IStockroom[];
            totalRows: number;
        }
    }

    export class GetByIdStockroom implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IStockroom
    }

    export interface CreateStockroom {
        kode_stokroom: string
        nama_stokroom: string
    }

    export interface UpdateStockroom {
        id_stokroom: string
        kode_stokroom: string
        nama_stokroom: string
        is_active: boolean
    }
}