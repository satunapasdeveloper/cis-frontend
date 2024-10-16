import { HttpBaseResponse } from "../../http/http-request.model"

export namespace TindakanMedisModel {
    export interface ITindakanMedis {
        uuid: string
        tindakan: string
        icd_9: string
        id_poli: string
        poli: string
        harga: string
        kode_icd_9: string
        nama_icd_9: string
        is_active: boolean
    }

    export interface IIcd9 {
        id: string
        kode_icd_9: string
        nama_icd_9: string
        sab: string
    }

    export class GetAllTindakanMedis implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ITindakanMedis[]
    }

    export class GetByIdTindakanMedis implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ITindakanMedis
    }

    export class GetAllIcd9 implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IIcd9[]
    }

    export interface CreateTindakanMedis {
        kode_icd9: string
        display_icd9: string
        id_tindakan: string
        tindakan: string
        qty: number
        harga: number
        total: number
    }

    export interface UpdateTindakanMedis {
        uuid: string
        kode_icd9: string
        display_icd9: string
        id_tindakan: string
        tindakan: string
        qty: number
        harga: number
        total: number
    }
}