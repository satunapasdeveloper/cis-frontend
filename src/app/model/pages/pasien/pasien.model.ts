import { HttpBaseResponse } from "../../http/http-request.model"

export namespace PasienModel {
    export interface IPasien {
        id_pasien: string
        nik: string
        no_rekam_medis: string
        id_pasien_satu_sehat: string
        is_bayi_lahir: boolean
        nama_pasien: string
        no_telf: string
        gender: string
        tempat_lahir: string
        tanggal_lahir: string
        golongan_darah: any
        nama_ibu_kandung: any
        nik_ibu_kandung: any
        identitas_lain: any
        no_identitas_lain: any
        file_foto_nama: any
        file_foto_url: any
        kode_provinsi_ktp: any
        nama_provinsi_ktp: any
        kode_kabupaten_ktp: any
        nama_kabupaten_ktp: any
        kode_kecamatan_ktp: any
        nama_kecamatan_ktp: any
        kode_kelurahan_ktp: any
        nama_kelurahan_ktp: any
        kode_pos_ktp: any
        rt_ktp: any
        rw_ktp: any
        alamat_lengkap_ktp: any
        kode_provinsi_domisili: any
        nama_provinsi_domisili: any
        kode_kabupatan_domisili: any
        nama_kabupaten_domisili: any
        kode_kecamatan_domisili: any
        nama_kecamatan_domisili: any
        kode_kelurahan_domisili: any
        nama_kelurahan_domisili: any
        kode_pos_domisili: any
        rt_domisili: any
        rw_domisili: any
        alamat_lengkap_domisili: any
        pendidikan_terakhir: any
        pekerjaan: any
        status_pernikahan: any
        wna: any
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IPasienQueryParams {
        page: number;
        count: number;
        nik?: string;
        nama_pasien?: string;
        no_rekam_medis?: string;
        no_kartu?: string;
        tanggal_lahir?: string;
    }

    export class GetAllPasien implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IPasien[];
            totalRows: number;
        }
    }

    export class GetByIdPasien implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPasien
    }

    export interface CreatePasien {
        nik: string
        id_pasien_satu_sehat: string
        is_bayi_lahir: boolean
        nama_pasien: string
        no_telf: string
        gender: string
        tempat_lahir: string
        tanggal_lahir: string
        golongan_darah: string
        kode_provinsi_ktp: string
        nama_provinsi_ktp: string
        kode_kabupaten_ktp: string
        nama_kabupaten_ktp: string
        kode_kecamatan_ktp: string
        nama_kecamatan_ktp: string
        kode_kelurahan_ktp: string
        nama_kelurahan_ktp: string
        kode_pos_ktp: string
        rt_ktp: string
        rw_ktp: string
        alamat_lengkap_ktp: string
        kode_provinsi_domisili: string
        nama_provinsi_domisili: string
        kode_kabupatan_domisili: string
        nama_kabupaten_domisili: string
        kode_kecamatan_domisili: string
        nama_kecamatan_domisili: string
        kode_kelurahan_domisili: string
        nama_kelurahan_domisili: string
        kode_pos_domisili: string
        rt_domisili: string
        rw_domisili: string
        alamat_lengkap_domisili: string
        pendidikan_terakhir: string
        pekerjaan: string
        status_pernikahan: string
        wna: string
        nama_ibu_kandung: string
        nik_ibu_kandung: string
        identitas_lain: string
        no_identitas_lain: string
        file_foto_nama: string
        file_foto_url: string
        detail_penjamin: DetailPenjamin[]
    }

    export interface DetailPenjamin {
        id_penjamin: string
        nama_penjamin: string
        nomor_penjamin: string
        tanggal_berlaku: string
        tanggal_expired: string
        is_default: boolean
        is_active: boolean
    }

    export interface UpdatePasien {
        id_pasien: number
        nik: string
        id_pasien_satu_sehat: string
        is_bayi_lahir: boolean
        nama_pasien: string
        no_telf: string
        gender: string
        tempat_lahir: string
        tanggal_lahir: string
        golongan_darah: string
        kode_provinsi_ktp: string
        nama_provinsi_ktp: string
        kode_kabupaten_ktp: string
        nama_kabupaten_ktp: string
        kode_kecamatan_ktp: string
        nama_kecamatan_ktp: string
        kode_kelurahan_ktp: string
        nama_kelurahan_ktp: string
        kode_pos_ktp: string
        rt_ktp: string
        rw_ktp: string
        alamat_lengkap_ktp: string
        kode_provinsi_domisili: string
        nama_provinsi_domisili: string
        kode_kabupatan_domisili: string
        nama_kabupaten_domisili: string
        kode_kecamatan_domisili: string
        nama_kecamatan_domisili: string
        kode_kelurahan_domisili: string
        nama_kelurahan_domisili: string
        kode_pos_domisili: string
        rt_domisili: string
        rw_domisili: string
        alamat_lengkap_domisili: string
        pendidikan_terakhir: string
        pekerjaan: string
        status_pernikahan: string
        wna: string
        nama_ibu_kandung: string
        nik_ibu_kandung: string
        identitas_lain: string
        no_identitas_lain: string
        file_foto_nama: string
        file_foto_url: string
        is_active: boolean
    }

    export interface CreatePenjamin {
        id_pasien: number
        detail_penjamin: DetailPenjamin[]
    }

    export interface UpdatePenjamin {
        id_pasien_penjamin: string;
        id_penjamin: string
        nama_penjamin: string
        nomor_penjamin: string
        tanggal_berlaku: string
        tanggal_expired: string
        is_default: boolean
        is_active: boolean
    }
}