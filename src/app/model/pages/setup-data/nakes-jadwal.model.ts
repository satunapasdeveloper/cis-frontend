import { HttpBaseResponse } from "../../http/http-request.model"

export namespace NakesJadwalModel {
    export interface IJadwalNakes {
        id_nakes_jadwal: string
        id_nakes: number
        nama: string
        id_hari: number
        jam_mulai: string
        jam_selesai: string
        urut: number
        is_active: boolean
    }

    export interface IJadwalNakesQueryParams {
        page: number;
        count: number;
        id_nakes?: number;
        id_hari?: number;
    }

    export class GetAllJadwalNakes implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IJadwalNakes[];
            totalRows: number;
        }
    }

    export interface CreateJadwalNakes {
        id_nakes: string
        id_hari: number
        jam_mulai: string
        jam_selesai: string
        urut: number
    }

    export interface UpdateJadwalNakes {
        id_nakes_jadwal: string
        id_nakes: string
        id_hari: number
        jam_mulai: string
        jam_selesai: string
        urut: number
        is_active: boolean
    }
}