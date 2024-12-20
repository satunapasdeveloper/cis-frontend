import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace AntrianPoliklinikRawatJalanModel {
    export interface IAntrian {
        id_register: string
        no_antrian: string | any
        no_register: string
        id_pasien: string
        nama_pasien: string
        gender: string
        tanggal_lahir: string
        tanggal_admisi: string
        tanggal_pulang: string | any
        id_poli: number
        id_jadwal_dokter: string;
        id_hari: string;
        jam_mulai: string;
        jam_selesai: string;
        id_dokter: string
        nama_dokter: string
        id_penjamin: number
        nama_penjamin: string
        status_bpjs: string
        status_register: string
    }

    export interface IQueryParams {
        page: number;
        count: number;
        tanggal_admisi: string;
        id_poli?: string;
        id_dokter?: string;
        nama_pasien?: string;
    }

    export class GetAll implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IAntrian[];
            totalRows: number;
        }
    }
}