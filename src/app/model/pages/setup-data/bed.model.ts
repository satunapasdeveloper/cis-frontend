import { HttpBaseResponse } from "../../http/http-request.model"

export namespace BedModel {
    export interface IBed {
        id_bed: string
        id_kamar: string
        no_kamar: string;
        nomor_bed: string
        tampilkan_di_antrian: boolean
        sesuai_sk: boolean
        status_aktif: boolean
    }

    export class GetAllBed implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IBed[]
    }

    export class GetByIdBed implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IBed
    }

    export interface CreateBed {
        id_kamar: string
        nomor_bed: string
        tampilkan_di_antrian: boolean
        sesuai_sk: boolean
    }

    export interface UpdateBed {
        id_bed: string
        id_kamar: string
        nomor_bed: string
        tampilkan_di_antrian: boolean
        sesuai_sk: boolean
    }
}