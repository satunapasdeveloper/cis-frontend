import { HttpBaseResponse } from "../../http/http-request.model"

export namespace RekananPenunjangModel {
    export interface IRekananPenunjang {
        id_rekanan_penunjang: string
        kode_rekanan: string
        nama_rekanan: string
        alamat: string
        no_telp: string
        is_active: boolean
    }

    export class GetAllRekananPenunjang implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRekananPenunjang[]
    }

    export class GetByIdRekananPenunjang implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRekananPenunjang
    }

    export interface CreateRekananPenunjang {
        kode_rekanan: string
        nama_rekanan: string
        alamat: string
        no_telp: string
    }

    export interface UpdateRekananPenunjang {
        id_rekanan_penunjang: number
        kode_rekanan: string
        nama_rekanan: string
        alamat: string
        no_telp: string
        is_active: boolean
    }
}