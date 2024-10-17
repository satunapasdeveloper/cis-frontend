import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace PabrikModel {
    export interface IPabrik {
        id_manufacture: string
        kode_manufacture: string
        nama_manufacture: string
        id_provinsi: number
        provinsi: string
        id_kota: number
        kota: string
        id_kecamatan: number
        kecamatan: string
        is_active: boolean
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
    }

    export interface IQueryString {
        page: number;
        count: number;
        kode_manufacture?: string;
        nama_manufacture?: string;
        provinsi?: string;
        kota?: string;
        kecamatan?: string;
    }

    export class GetAllPabrik implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPabrik[]
    }

    export class GetByIdPabrik implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPabrik
    }

    export interface CreatePabrik {
        kode_manufacture: string
        nama_manufacture: string
        id_provinsi: number
        provinsi: string
        id_kota: number
        kota: string
        id_kecamatan: number
        kecamatan: string
    }

    export interface UpdatePabrik {
        id_manufacture: string
        kode_manufacture: string
        nama_manufacture: string
        id_provinsi: number
        provinsi: string
        id_kota: number
        kota: string
        id_kecamatan: number
        kecamatan: string
    }
}