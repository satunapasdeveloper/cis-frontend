import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace SupplierModel {
    export interface ISupplier {
        id_supplier: number
        kode_supplier: string
        nama_supplier: string
        alamat: string
        npwp: string
        id_provinsi: number
        provinsi: string
        id_kota: number
        kota: string
        id_kecamatan: number
        kecamatan: string
        contact_person: string
        no_wa: string
        is_active: boolean
        user_inputed: string
        time_inputed: string
        user_last_update: string
        time_last_update: string
    }

    export interface IQueryString {
        page: number;
        count: number;
        kode_supplier?: string;
        nama_supplier?: string;
    }

    export class GetAllSupplier implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: ISupplier[];
            totalRows: number;
        }
    }

    export class GetByIdSupplier implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISupplier
    }

    export interface CreateSupplier {
        kode_supplier: string
        nama_supplier: string
        alamat: string
        npwp: string
        id_provinsi: number
        provinsi: string
        id_kota: number
        kota: string
        id_kecamatan: number
        kecamatan: string
        contact_person: string
        no_wa: string
    }

    export interface UpdateSupplier {
        id_supplier: number
        kode_supplier: string
        nama_supplier: string
        alamat: string
        npwp: string
        id_provinsi: number
        provinsi: string
        id_kota: number
        kota: string
        id_kecamatan: number
        kecamatan: string
        contact_person: string
        no_wa: string
    }
}