import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace SetupKelompokTarifModel {
    export interface IKelompokTarif {
        id_tarif_kelompok: number
        kode_tarif_kelompok: string
        nama_tarif_kelompok: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: string
    }

    export interface IKelompokTarifQueryParams {
        page: number;
        count: number;
        kode_tarif_kelompok?: string;
        nama_tarif_kelompok?: string;
    }

    export class GetAll implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            totalRows: number
            page: string
            rows: IKelompokTarif[]
        }
    }

    export interface Create {
        kode_tarif_kelompok: string
        nama_tarif_kelompok: string
    }

    export interface Update {
        id_tarif_kelompok: number
        kode_tarif_kelompok: string
        nama_tarif_kelompok: string
        is_active: boolean
    }

}