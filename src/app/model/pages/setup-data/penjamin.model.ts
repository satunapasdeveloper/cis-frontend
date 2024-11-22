import { HttpBaseResponse } from "../../http/http-request.model"

export namespace PenjaminModel {
    export interface IPenjamin {
        id_penjamin: string
        penjamin: string
        status_aktif: boolean
    }

    export class GetAllPenjamin implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPenjamin[]
    }

    export class GetByIdPenjamin implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPenjamin
    }

    export interface CreatePenjamin {
        penjamin: string
    }

    export interface UpdatePenjamin {
        id_penjamin: string
        penjamin: string
    }
}