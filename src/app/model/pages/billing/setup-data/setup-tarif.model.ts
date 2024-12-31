import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace SetupTarifModel {
    export interface ITarif {
        id_tarif: number
        id_tarif_grup: number
        jenis_tarif: string
        kode_tarif_grup: string
        nama_tarif_grup: string
        kode_grup_penunjang: any
        id_tarif_kelompok: number
        kode_tarif_kelompok: string
        nama_tarif_kelompok: string
        kode_tarif: string
        nama_tarif: string
        is_irja: boolean
        is_irna: boolean
        is_irda: boolean
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export class GetAll implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ITarif[]
    }

    export interface GetAllQueryParams {
        page: number;
        count: number;
        id_tarif_grup?: number;
        id_tarif_kelompok?: number;
        kode_tarif?: string;
        nama_tarif?: string;
    }

    export interface GetForTindakanMedisQueryParams {
        id_poli: number;
        id_kelas: number;
        jenis_rawat: string;
    }

    export interface Create {
        id_tarif_grup: number
        id_tarif_kelompok: number
        kode_tarif: string
        nama_tarif: string
        detail_poli: {
            id_poli: number
        }[]
        detail_kelas: {
            id_kelas: number
            nominal_tarif: number
        }[]
    }

    export interface Update {
        id_tarif: number
        id_tarif_grup: number
        id_tarif_kelompok: number
        kode_tarif: string
        nama_tarif: string
        detail_poli: {
            id_poli: number
        }[]
        detail_kelas: {
            id_kelas: number
            nominal_tarif: number
        }[]
        is_active: boolean
    }
}