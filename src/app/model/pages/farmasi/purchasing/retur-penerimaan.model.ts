import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace ReturPembelianModel {
    export interface IReturPembelian {
        id_retur_penerimaan: string
        tgl_retur: string
        id_stockroom: string
        kode_stockroom: string
        nama_stockroom: string
        id_supplier: string
        kode_supplier: string
        nama_supplier: string
        mekanisme: string
        keterangan: string
        jumlah_item: string
        total_harga: string
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
        detail: IReturPembelianDetail[]
    }

    export interface IReturPembelianDetail {
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
            rows: IReturPembelian[];
            totalRows: number;
        }
    }

    export class GetById implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IReturPembelian
    }

    export interface Create {
        tgl_retur: string
        id_stockroom: string
        id_supplier: string
        mekanisme: string
        keterangan: string
        jumlah_item: string
        total_harga: string
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
        id_retur_penerimaan: string;
        keterangan: string;
    }
}