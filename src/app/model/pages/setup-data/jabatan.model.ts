import { HttpBaseResponse } from "../../http/http-request.model"

export namespace JabatanModel {
    export interface IJabatan {
        id_jabatan: string
        nama_jabatan: string
        is_active: boolean;
    }

    export interface IJabatanQueryParams {
        page: number;
        count: number;
        nama_jabatan?: string;
    }

    export class GetAllJabatan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IJabatan[];
            totalRows: number;
        }
    }

    export class GetByIdJabatan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IJabatan
    }

    export interface CreateJabatan {
        nama_jabatan: string
    }

    export interface UpdateJabatan {
        id_jabatan: string
        nama_jabatan: string
        is_active: boolean;
    }
}