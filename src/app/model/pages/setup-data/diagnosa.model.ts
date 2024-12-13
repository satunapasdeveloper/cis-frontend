import { HttpBaseResponse } from "../../http/http-request.model"

export namespace DiagnosaModel {
    export interface IDiagnosa {
        id_diagnosa: number
        nama_diagnosa: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IDiagnosaQueryParams {
        page: number;
        count: number;
        nama_diagnosa?: string;
    }

    export class GetAllDiagnosa implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IDiagnosa[];
            totalRows: number;
        }
    }

    export class GetByIdDiagnosa implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IDiagnosa
    }

    export interface CreateDiagnosa {
        nama_diagnosa: string
    }

    export interface UpdateDiagnosa {
        id_diagnosa: number
        nama_diagnosa: string
        is_active: boolean
    }
}