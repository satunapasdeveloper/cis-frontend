import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace PenerimaanBarangModel {
    export interface IPenerimaanBarang {
        id_penerimaan: string
        no_penerimaan: string
        tgl_penerimaan: string
        id_stockroom: string
        kode_stockroom: string
        nama_stockroom: string
        id_supplier: string
        kode_supplier: string
        nama_supplier: string
        keterangan: string
        jumlah_item: string
        created_at: string
        updated_at: string
        created_by: string
        updated_by: string
        detail: IPenerimaanBarangDetail[]
    }

    export interface IPenerimaanBarangDetail {
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
    }

    export interface IQueryString {
        page: number;
        count: number;
        no_penerimaan?: string;
        tgl_penerimaan?: string;
    }

    export class GetAll implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IPenerimaanBarang[];
            totalRows: number;
        }
    }

    export class GetById implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPenerimaanBarang
    }

    export interface Create {
        tgl_penerimaan: string
        id_stockroom: string
        id_supplier: string
        keterangan: string
        jumlah_item: number
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
    }

    export interface Cancel {
        id_purchasing_order: string;
        keterangan: string;
    }
}