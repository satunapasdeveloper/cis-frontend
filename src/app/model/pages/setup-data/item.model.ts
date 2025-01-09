import { HttpBaseResponse } from "../../http/http-request.model"

export namespace ItemModel {
    export interface IItem {
        id_item: number
        kode_item: string
        nama_item: string
        id_supplier: number
        golongan: string
        kode_kfa: string
        name_kfa: string
        kfa_code: string
        id_item_grup: number
        nama_grup: string;
        is_obat_darurat_urgensi: boolean
        is_hight_alert: boolean
        is_lasa: boolean
        catatan: string
        satuan_jual: string
        harga_beli_terakhir: number
        hpp_average: number
        harga_netto: number
        kandungan: number
        kapasitas: number
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: string
        detail_jenis: string[];
        detail_satuan: {
            id_satuan: number
            isi: number
        }[]
    }

    export interface IItemParams {
        page: number;
        count: number;
        kode_item?: string;
        nama_item?: string;
        kode_kfa?: string;
    }

    export class GetAllItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IItem[];
            totalRows: number;
        }
    }

    export class GetByIdItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IItem
    }

    export interface CreateItem {
        kode_item: string
        nama_item: string
        id_supplier: number
        golongan: string
        kode_kfa: string
        display_kfa: any
        id_item_grup: number
        is_obat_darurat_urgensi: boolean
        is_hight_alert: boolean
        is_lasa: boolean
        catatan: string
        satuan_jual: string
        kandungan: string
        kapasitas: number
        detail_jenis: {
            jenis: string
        }[]
        detail_satuan: {
            id_satuan: number
            isi: string
        }[]
    }

    export interface UpdateItem {
        id_item: number
        kode_item: string
        nama_item: string
        id_supplier: number
        golongan: string
        kode_kfa: string
        display_kfa: any
        id_item_grup: number
        is_obat_darurat_urgensi: boolean
        is_hight_alert: boolean
        is_lasa: boolean
        catatan: string
        satuan_jual: string
        kandungan: string
        kapasitas: number
        detail_jenis: {
            jenis: string
        }[]
        detail_satuan: {
            id_satuan: number
            isi: string
        }[]
        is_active: boolean
    }
}