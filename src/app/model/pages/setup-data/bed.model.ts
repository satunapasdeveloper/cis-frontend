import { HttpBaseResponse } from "../../http/http-request.model"

export namespace BedModel {
    export interface IBed {
        id_bed: string
        id_bed_kamar: string
        no_kamar: string;
        no_lantai: string;
        no_bed: string;
        is_tampilkan_antrian: boolean
        is_sesuai_sk: boolean
        is_active: boolean;
    }

    export interface IBedQueryParams {
        page: number;
        count: number;
        no_bed?: string;
    }

    export class GetAllBed implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IBed[];
            totalRows: number;
        }
    }

    export class GetByIdBed implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IBed
    }

    export interface CreateBed {
        id_bed_kamar: string
        no_bed: string
        is_tampilkan_antrian: boolean
        is_sesuai_sk: boolean
    }

    export interface UpdateBed {
        id_bed: string
        id_bed_kamar: string
        no_bed: string
        is_tampilkan_antrian: boolean
        is_sesuai_sk: boolean
        is_active: boolean;
    }
}