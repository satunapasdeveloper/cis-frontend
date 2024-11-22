import { HttpBaseResponse } from "../../http/http-request.model"

export namespace PoliModel {
    export interface IPoli {
        id_poli: string
        kode_poli: string
        poli: string
        id_unit: string;
        nama_unit: string;
        kode_poli_bpjs: string
        id_poli_satusehat: string
    }

    export class GetAllPoli implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPoli[]
    }

    export class GetByIdPoli implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPoli
    }

    export interface CreatePoli {
        kode_poli: string
        poli: string
        id_unit: string;
        kode_poli_bpjs: string
        id_poli_satusehat: string
    }

    export interface UpdatePoli {
        id_poli: string
        kode_poli: string
        poli: string
        id_unit: string;
        kode_poli_bpjs: string
        id_poli_satusehat: string
    }
}