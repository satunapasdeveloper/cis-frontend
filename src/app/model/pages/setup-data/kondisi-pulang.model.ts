import { HttpBaseResponse } from "../../http/http-request.model"

export namespace KondisiPulangModel {
    export interface IKondisiPulang {
        id_kondisi_pulang: number
        kondisi_pulang: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IKondisiPulangQueryParams {
        page: number;
        count: number;
        kondisi_pulang?: string;
    }

    export class GetAllKondisiPulang implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IKondisiPulang[];
            totalRows: number;
        }
    }

    export class GetByIdKondisiPulang implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKondisiPulang
    }

    export interface CreateKondisiPulang {
        kondisi_pulang: string
    }

    export interface UpdateKondisiPulang {
        id_kondisi_pulang: number
        kondisi_pulang: string
        is_active: boolean
    }
}