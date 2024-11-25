import { HttpBaseResponse } from "../../http/http-request.model"

export namespace KelasModel {
    export interface IKelas {
        id_kelas: string
        nama_kelas: string
        kode_kelas: string
        kode_kelas_bpjs: string
        id_kelas_satu_sehat: string
        is_active: boolean;
    }

    export interface IKelasQueryParams {
        page: number;
        count: number;
        nama_kelas?: string;
        kode_kelas?: string;
        kode_kelas_bpjs?: string;
    }

    export class GetAllKelas implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IKelas[];
            totalRows: number;
        }
    }

    export class GetByIdKelas implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKelas
    }

    export interface CreateKelas {
        nama_kelas: string
        kode_kelas: string
        kode_kelas_bpjs: string
        id_kelas_satu_sehat: string
    }

    export interface UpdateKelas {
        id_kelas: string
        nama_kelas: string
        kode_kelas: string
        kode_kelas_bpjs: string
        id_kelas_satu_sehat: string
        is_active: boolean;
    }
}