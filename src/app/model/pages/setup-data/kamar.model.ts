import { HttpBaseResponse } from "../../http/http-request.model"

export namespace KamarModel {
    export interface IKamar {
        id_bed_kamar: string
        id_bed_kategori: string
        nama_kategori: string
        no_kamar: string
        label_kamar: string
        no_lantai: string
        id_poli: string
        nama_poli: string
        id_kelas: string
        nama_kelas: string
        gender: string
        keterangan: string
        is_isolasi: boolean
        is_active: boolean
    }

    export interface IKamarQueryParams {
        page: number;
        count: number;
        no_kamar?: string;
        label_kamar?: string;
        no_lantai?: string;
    }

    export class GetAllKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IKamar[];
            totalRows: number;
        }
    }

    export class GetByIdKamar implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IKamar
    }

    export interface CreateKamar {
        id_bed_kategori: string
        no_kamar: string
        label_kamar: string
        no_lantai: string
        id_poli: string
        id_kelas: string
        gender: string
        keterangan: string
        is_isolasi: boolean
        is_active: boolean
    }

    export interface UpdateKamar {
        id_bed_kamar: string
        id_bed_kategori: string
        no_kamar: string
        label_kamar: string
        no_lantai: string
        id_poli: string
        id_kelas: string
        gender: string
        keterangan: string
        is_isolasi: boolean
        is_active: boolean
    }
}