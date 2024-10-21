import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace PurchasingOrderModel {
    export interface IPurchasingOrder {
        id_purchasing_order: string
        no_pemesanan: string
        tgl_pemesanan: string
        tgl_expired: string
        id_stockroom: string
        kode_stockroom: string
        nama_stockroom: string
        id_supplier: string
        kode_supplier: string
        nama_supplier: string
        kode_golongan: string
        nama_golongan: string
        keterangan: string
        jml_item: string
        total: string
        is_active: boolean
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
        detail: IPurchasingOrderDetail[]
    }

    export interface IPurchasingOrderDetail {
        nomor_urut: string
        barcode: string
        id_item: string
        kode_item: string
        nama_item: string
        banyak: number
        satuan: string
        isi: number
        qty: number
        harga_satuan: number
        sub_total: number
    }

    export interface IQueryString {
        page: number;
        count: number;
        no_pemesanan?: string;
        tgl_pemesanan?: string;
    }

    export class GetAll implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IPurchasingOrder[];
            totalRows: number;
        }
    }

    export class GetById implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPurchasingOrder
    }

    export interface Create {
        no_pemesanan: string
        tgl_pemesanan: string
        tgl_expired: string
        id_stockroom: string
        id_supplier: string
        keterangan: string
    }

    export interface CreateDetail {
        nomor_urut: string
        id_item: string
        banyak: number
        satuan: string
        isi: number
        qty: number
        harga_satuan: number
        sub_total: number
    }

    export interface Cancel {
        id_purchasing_order: string;
        keterangan: string;
    }
}