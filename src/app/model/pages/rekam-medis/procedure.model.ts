import { HttpBaseResponse } from "../../http/http-request.model"

export namespace ProcedureModel {
    export interface Icd9 {
        id: string
        kode_icd_9: string
        nama_icd_9: string
        sab: string
    }

    export class GetAllIcd9 implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            totalRows: number;
            page: string;
            rows: Icd9[]
        }
    }

    export interface IProcedure {
        id_procedure: string
        id_register: string
        kode_icd_9: string
        nama_icd_9: string
        sab_icd_9: string
        created_at: string
        created_by: string
        register: {
            id_register: string
            id_pasien: string
        }
    }

    export class GetAllProcedure implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IProcedure[]
    }

    export interface UpdateProcedure {
        id_register: number
        detail: {
            kode_icd_9: string
            nama_icd_9: string
            sab_icd_9: string
        }[]
    }
}