import { HttpBaseResponse } from "../../http/http-request.model"

export namespace LokasiModel {
    export interface IProvinsi {
        id: string
        name: string
    }

    export class GetProvinsi implements HttpBaseResponse {
        responseResult!: boolean
        message!: string
        statusCode!: number
        data!: IProvinsi[]
    }

    export interface IKota {
        id: string
        province_id: string
        name: string
    }

    export class GetKota implements HttpBaseResponse {
        responseResult!: boolean
        message!: string
        statusCode!: number
        data!: IKota[]
    }

    export interface IKecamatan {
        id: string
        regency_id: string
        name: string
    }

    export class GetKecamatan implements HttpBaseResponse {
        responseResult!: boolean
        message!: string
        statusCode!: number
        data!: IKecamatan[]
    }

    export interface IKelurahan {
        id: string
        district_id: string
        name: string
    }

    export class GetKelurahan implements HttpBaseResponse {
        responseResult!: boolean
        message!: string
        statusCode!: number
        data!: IKelurahan[]
    }
}