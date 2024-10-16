import { HttpBaseResponse } from "../../http/http-request.model"

export namespace DiagnosisModel {
    export interface IDiagnosisi {
        id_pendaftaran: number
        kode_icd10: string
        display_icd10: string
        jenis_diagnosis: string
        keterangan: string
    }

    export interface IIcd10 {
        id: string
        kode_icd_10: string
        nama_icd_10: string
        sab: string
    }

    export class GetAllIcd10 implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IIcd10[]
    }

    export interface CreateDiagnosa {
        diagnosisi: IDiagnosisi[]
    }
}