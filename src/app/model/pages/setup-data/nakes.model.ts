import { HttpBaseResponse } from "../../http/http-request.model"

export namespace NakesModel {
    export interface INakes {
        id_nakes: string
        nik: string
        nama: string
        file_foto_name: string
        file_foto_url: string
        id_jabatan: string
        nama_jabatan: string
        id_poli: string;
        nama_poli: string;
        id_role: string;
        nama_role: string;
        username: string;
        password: string;
        kode_dpjp: string;
        id_satu_sehat: string;
        hfis: string;
        is_active: string;
    }

    export interface INakesQueryParams {
        page: number;
        count: number;
        nama?: string;
        nik?: string;
        username?: string;
    }

    export class GetAllNakes implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: INakes[];
            totalRows: number;
        }
    }

    export class GetByIdNakes implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: INakes
    }

    export interface CreateNakes {
        nik: string
        nama: string
        file_foto_name: string
        file_foto_url: string
        id_jabatan: string
        id_poli: string;
        id_role: string;
        username: string;
        password: string;
        kode_dpjp: string;
        id_satu_sehat: string;
        hfis: string;
    }

    export interface UpdateNakes {
        id_nakes: string
        nik: string
        nama: string
        file_foto_name: string
        file_foto_url: string
        id_jabatan: string
        id_poli: string;
        id_role: string;
        username: string;
        password: string;
        kode_dpjp: string;
        id_satu_sehat: string;
        hfis: string;
        is_active: boolean;
    }
}