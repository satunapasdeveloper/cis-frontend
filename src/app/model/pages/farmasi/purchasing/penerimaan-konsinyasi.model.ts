import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace PenerimaanKonsinyasiModel {
    export interface IPenerimaanKonsinyasi {
        id_penerimaan_konsinyasi: string
        no_pemesanan: string
        tgl_pemesanan: string
        tgl_expired: string
        id_stockroom: string
        kode_stockroom: string
        nama_stockroom: string
        id_supplier: string
        kode_supplier: string
        nama_supplier: string
        keterangan: string
        jumlah_item: number
        total_harga: number
        diskon_persen: number
        diskon_nominal: number
        subtotal_1: number
        ppn_persen: number
        ppn_nominal: number
        subtotal_2: number
        pembulatan: number
        grand_total: number
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
        detail: IPenerimaanKonsinyasiDetail[]
    }

    export interface IPenerimaanKonsinyasiDetail {
        nomor_urut: string
        barcode: string
        id_item: string
        kode_item: string
        nama_item: string
        batch: string
        tanggal_expired: string
        banyak: number
        satuan: string
        isi: number
        qty: number
        harga_netto: number
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
            rows: IPenerimaanKonsinyasi[];
            totalRows: number;
        }
    }

    export class GetById implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPenerimaanKonsinyasi
    }

    export interface Create {
        tgl_pemesanan: string
        id_stockroom: string
        id_supplier: string
        keterangan: string
        jumlah_item: number
        total_harga: number
        diskon_persen: number
        diskon_nominal: number
        subtotal_1: number
        ppn_persen: number
        ppn_nominal: number
        subtotal_2: number
        pembulatan: number
        grand_total: number
    }

    export interface CreateDetail {
        nomor_urut: string
        id_item: string
        batch: string
        tanggal_expired: string
        banyak: number
        satuan: string
        isi: number
        qty: number
        harga_netto: number
        sub_total: number
    }

    export interface Cancel {
        id_penerimaan_konsinyasi: string;
        keterangan: string;
    }
}