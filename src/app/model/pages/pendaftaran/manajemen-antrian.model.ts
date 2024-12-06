import { HttpBaseResponse } from "../../http/http-request.model"

export namespace ManajemenAntrianModel {
    export interface IPanggilAntrian {
        id_antrian: string
        no_antrian: string
        id_antrian_jenis: number
        jenis_antrian: string
        id_antrian_status: number
        status_antrian: string;
        created_at: string
        id_loket: number
        calling_at?: string
        is_calling_now?: boolean
        id_pendaftaran?: any
        start_admisi_at?: any
        start_admisi_by?: any
        end_admisi_at?: any
        end_admisi_by?: any
    }

    export class PanggilAntrian implements HttpBaseResponse {
        responseResult!: boolean
        message!: string
        statusCode!: number
        data!: IPanggilAntrian
    }

    export interface ISkipAntrian {
        id_antrian: string
        no_antrian: string
        id_antrian_jenis: number
        id_antrian_status: number
        created_at: string
        id_loket: any
        calling_at: any
        is_calling_now: boolean
        id_pendaftaran: any
        start_admisi_at: any
        start_admisi_by: any
        end_admisi_at: any
        end_admisi_by: any
        antrian_status: {
            id_antrian_status: number;
            status_antrian: string;
        }
    }

    export class SkipAntrian implements HttpBaseResponse {
        responseResult!: boolean
        message!: string
        statusCode!: number
        data!: ISkipAntrian
    }
}