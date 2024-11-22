import { HttpBaseResponse } from "../../http/http-request.model"

export namespace NakesModel {
    export interface INakes {
        id_nakes: string
        nik: string
        nama: string
        foto: string
        id_jabatan: string
        jabatan: string
        id_poli: string;
        poli: string;
        id_role: string;
        role: string;
        username: string;
        password: string;
        kode_dpjp: string;
        id_satu_sehat: string;
        hfis: string;
        status_aktif: string;
    }

    export class GetAllNakes implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: INakes[]
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
        foto: string
        id_jabatan: string
        id_poli: string;
        id_role: string;
        username: string;
        password: string;
        kode_dpjp: string;
        id_satu_sehat: string;
        hfis: string;
        status_aktif: string;
    }

    export interface UpdateNakes {
        id_nakes: string
        nik: string
        nama: string
        foto: string
        id_jabatan: string
        id_poli: string;
        id_role: string;
        username: string;
        password: string;
        kode_dpjp: string;
        id_satu_sehat: string;
        hfis: string;
        status_aktif: string;
    }
}