import { HttpBaseResponse } from "../../http/http-request.model"
import { ResepModel } from "./resep.model"
import { TindakanModel } from "./tindakan.model"

export namespace BillingModel {
    export interface ITagihan {
        obat: ResepModel.IObat[]
        tindakan: TindakanModel.ITindakan[]
        bmhp: TindakanModel.IBmhp[]
        subtotal: number
        diskon: number
        total: number
        payment_method: string
        id_pendaftaran: string
    }

    export class GetTagihan implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ITagihan
    }

    export interface IHistoryPembayaran {
        id_pendaftaran: string
        no_pendaftaran: string
        no_antrian: string
        angka_antrian: number
        tanggal_visit: string
        pre_assessment: boolean
        status_billing: boolean
        status_pasien: string
        status_pulang: string
        debitur: string
        created_at: string
        no_rekam_medis: string
        nama_lengkap: string
        nik: string
        id_dokter: string
        jam_mulai: string
        jam_selesai: string
        dokter: string
        no_invoice: string
        tanggal_invoice: string
        harga: number
        diskon: number
        total: number
        no_kuitansi: string
        payment_method: string
    }

    export class GetAllHistoryPembayaran implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IHistoryPembayaran[]
    }

    export interface IInvoice {
        obat: IDetailInvoice[]
        tindakan: IDetailInvoice[]
        bmhp: IDetailInvoice[]
        subtotal: number
        diskon: number
        total: number
        payment_method: string
        id_pendaftaran: number
        tanggal: string
    }

    export interface IDetailInvoice {
        data: string
        kode: number
        grup: string
        deskripsi: string
        jumlah: number
        harga: number
        total_harga: number
    }
}