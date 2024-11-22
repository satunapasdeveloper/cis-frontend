import { HttpBaseResponse } from "../../http/http-request.model"

export namespace KelasModel {
    export interface IKelas {
        id_kelas: string
        kelas: string
        kode_kelas: string
        kode_kelas_bpjs: string
        id_kelas_satu_sehat: string
    }

    export class GetAllKelas implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKelas[]
    }

    export class GetByIdKelas implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKelas
    }

    export interface CreateKelas {
        kelas: string
        kode_kelas: string
        kode_kelas_bpjs: string
        id_kelas_satu_sehat: string
    }

    export interface UpdateKelas {
        id_kelas: string
        kelas: string
        kode_kelas: string
        kode_kelas_bpjs: string
        id_kelas_satu_sehat: string
    }
}