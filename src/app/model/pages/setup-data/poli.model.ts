import { HttpBaseResponse } from "../../http/http-request.model"

export namespace PoliModel {
    export interface IPoli {
        id_poli: string
        kode_poli: string
        nama_poli: string
        id_unit: string;
        nama_unit: string;
        kode_poli_bpjs: string
        id_poli_satu_sehat: string
        is_active: boolean;
    }

    export interface IPoliQueryParams {
        page: number;
        count: number;
        id_unit?: string;
        nama_poli?: string;
        kode_poli?: string;
    }

    export class GetAllPoli implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IPoli[];
            totalRows: number;
        }
    }

    export class GetByIdPoli implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPoli
    }

    export interface CreatePoli {
        kode_poli: string
        nama_poli: string
        id_unit: string;
        kode_poli_bpjs: string
        id_poli_satu_sehat: string
    }

    export interface UpdatePoli {
        id_poli: string
        kode_poli: string
        nama_poli: string
        id_unit: string;
        kode_poli_bpjs: string
        id_poli_satu_sehat: string
        is_active: boolean;
    }
}