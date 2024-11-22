import { HttpBaseResponse } from "../../http/http-request.model"

export namespace JabatanModel {
    export interface IJabatan {
        id_jabatan: string
        jabatan: string
    }

    export class GetAllJabatan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IJabatan[]
    }

    export class GetByIdJabatan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IJabatan
    }

    export interface CreateJabatan {
        jabatan: string
    }

    export interface UpdateJabatan {
        id_jabatan: string
        jabatan: string
    }
}