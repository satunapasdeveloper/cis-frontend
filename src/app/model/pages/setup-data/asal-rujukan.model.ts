import { HttpBaseResponse } from "../../http/http-request.model"

export namespace AsalRujukanModel {
    export interface IAsalRujukan {
        id_asal_rujukan: number
        asal_rujukan: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IAsalRujukanQueryParams {
        page: number;
        count: number;
        asal_rujukan?: string;
    }

    export class GetAllAsalRujukan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IAsalRujukan[];
            totalRows: number;
        }
    }

    export class GetByIdAsalRujukan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IAsalRujukan
    }

    export interface CreateAsalRujukan {
        asal_rujukan: string
    }

    export interface UpdateAsalRujukan {
        id_asal_rujukan: number
        asal_rujukan: string
        is_active: boolean
    }
}