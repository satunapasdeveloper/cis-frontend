import { HttpBaseResponse } from "../../http/http-request.model"

export namespace ItemModel {
    export interface IItem {
        uuid: string
        kategori: string
        nama_item: string
        kode_kfa: string
        satuan: string
        harga_jual: string
        is_active: boolean
    }

    export interface IKfa {
        id_item: string
        kategori: string
        kode_kfa: string
        satuan: string
        nama_item: string
    }

    export class GetAllItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IItem[]
    }

    export class GetByIdItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IItem
    }

    export class GetAllKfa implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKfa[]
    }

    export interface CreateItem {
        kategori: string
        nama_item: string
        kode_kfa: string
        satuan: string
        harga_jual: number
    }

    export interface UpdateItem {
        uuid: string
        kategori: string
        nama_item: string
        kode_kfa: string
        satuan: string
        harga_jual: number
    }
}