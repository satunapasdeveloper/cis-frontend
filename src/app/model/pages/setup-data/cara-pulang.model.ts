import { HttpBaseResponse } from "../../http/http-request.model"

export namespace CaraPulangModel {
    export interface ICaraPulang {
        id_cara_pulang: number
        cara_pulang: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface ICaraPulangQueryParams {
        page: number;
        count: number;
        cara_pulang?: string;
    }

    export class GetAllCaraPulang implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: ICaraPulang[];
            totalRows: number;
        }
    }

    export class GetByIdCaraPulang implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ICaraPulang
    }

    export interface CreateCaraPulang {
        cara_pulang: string
    }

    export interface UpdateCaraPulang {
        id_cara_pulang: number
        cara_pulang: string
        is_active: boolean
    }
}