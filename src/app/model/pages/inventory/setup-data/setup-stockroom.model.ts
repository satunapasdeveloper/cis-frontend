import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace StockroomModel {
    export interface IStockroom {
        id_stockroom: string
        kode_stockroom: string
        nama_stockroom: string
        is_active: boolean
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
    }

    export interface IQueryString {
        page: number;
        count: number;
        kode_stockroom?: string;
        nama_stockroom?: string;
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
        kode_stockroom: string
        nama_stockroom: string
    }

    export interface UpdateStockroom {
        id_stockroom: string
        kode_stockroom: string
        nama_stockroom: string
    }
}