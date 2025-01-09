import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace RutePemberianObatModel {
    export interface IRutePemberianObat {
        id_rute_pemberian_obat: number
        kode_rute_pemberian_obat: string
        rute_pemberian_obat: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IRutePemberianObatQueryParams {
        page: number;
        count: number;
        kode_rute_pemberian_obat?: string
        rute_pemberian_obat?: string
    }

    export class GetAllRutePemberianObat implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IRutePemberianObat[];
            totalRows: number;
        }
    }

    export class GetByIdRutePemberianObat implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRutePemberianObat
    }

    export interface CreateRutePemberianObat {
        kode_rute_pemberian_obat: string
        rute_pemberian_obat: string
    }

    export interface UpdateRutePemberianObat {
        id_rute_pemberian_obat: number
        kode_rute_pemberian_obat: string
        rute_pemberian_obat: string
        is_active: boolean
    }
}