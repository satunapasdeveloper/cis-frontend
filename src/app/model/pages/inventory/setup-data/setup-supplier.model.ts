import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace SupplierModel {
    export interface ISupplier {
        id_supplier: number
        kode_supplier: string
        nama_supplier: string
        npwp: any
        no_hp: any
        alamat: string
        id_provinsi: number
        nama_provinsi: string
        id_kota: number
        nama_kota: string
        id_kecamatan: number
        nama_kecamatan: string
        id_desa: string
        nama_desa: string
        kode_pos: number
        kontak_person: string
        email: any
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
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
        npwp: string
        no_hp: string
        alamat: string
        id_provinsi: number
        nama_provinsi: string
        id_kota: number
        nama_kota: string
        id_kecamatan: number
        nama_kecamatan: string
        id_desa: number
        nama_desa: string
        kode_pos: number
        kontak_person: string
        email: string
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
        is_active: boolean
    }
}