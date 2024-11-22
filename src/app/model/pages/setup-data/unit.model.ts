import { HttpBaseResponse } from "../../http/http-request.model"

export namespace UnitModel {
    export interface IUnit {
        id_unit: string
        kode_unit: string
        nama_unit: string
    }

    export class GetAllUnit implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IUnit[]
    }

    export class GetByIdUnit implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IUnit
    }

    export interface CreateUnit {
        kode_unit: string
        nama_unit: string
    }

    export interface UpdateUnit {
        id_unit: string
        kode_unit: string
        nama_unit: string
    }
}