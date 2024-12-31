import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace SetupGrupTarifModel {
    export interface IGrupTarif {
        id_tarif_grup: number
        id_tarif_grup_parent: any
        jenis_tarif: string
        kode_tarif_grup: string
        nama_tarif_grup: string
        kode_grup_penunjang: any
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
        child: IGrupTarif[] | any
    }

    export class GetAll implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IGrupTarif[]
    }

    export interface CreateParent {
        jenis_tarif: string
        kode_tarif_grup: string
        nama_tarif_grup: string
        kode_grup_penunjang: string
    }

    export interface CreateChild {
        id_tarif_grup_parent: number
        jenis_tarif: string
        kode_tarif_grup: string
        nama_tarif_grup: string
        kode_grup_penunjang: string
    }

    export interface Update {
        id_tarif_grup: number
        id_tarif_grup_parent: number
        jenis_tarif: string
        kode_tarif_grup: string
        nama_tarif_grup: string
        kode_grup_penunjang: string
        is_active: boolean
    }

}