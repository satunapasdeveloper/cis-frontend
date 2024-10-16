import { HttpBaseResponse } from "../../http/http-request.model"

export namespace PasienModel {
    export interface IPasien {
        no_rekam_medis: string
        nik: string
        wna: string
        is_pasien_bayi: boolean
        nama_lengkap: string
        nama_ibu_kandung: string
        tempat_lahir: string
        tanggal_lahir: string
        jenis_kelamin: string
        alamat_lengkap: string
        id_provinsi: string
        provinsi: string
        id_kabupaten: string
        kabupaten: string
        id_kecamatan: string
        kecamatan: string
        id_kelurahan: string
        kelurahan: string
        kode_pos: string
        rt: string
        rw: string
        ktp_alamat_lengkap: string
        ktp_id_provinsi: string
        ktp_provinsi: string
        ktp_id_kabupaten: string
        ktp_kabupaten: string
        ktp_id_kecamatan: string
        ktp_kecamatan: string
        ktp_id_kelurahan: string
        ktp_kelurahan: string
        ktp_kode_pos: string
        ktp_rt: string
        ktp_rw: string
        no_hp: string
        no_telpon: string
        pendidikan_terakhir: string
        pekerjaan: string
        status_pernikahan: string
        methode_pembayaran: string
        created_by: string
    }

    export class GetAllPasien implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPasien[]
    }

    export class GetByIdPasien implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IPasien
    }

    export interface CreatePasien {
        nik: string
        wna: string
        is_pasien_bayi: boolean
        nama_lengkap: string
        nama_ibu_kandung: string
        tempat_lahir: string
        tanggal_lahir: string
        jenis_kelamin: string
        ktp_alamat_lengkap: string
        ktp_id_provinsi: string
        ktp_id_kabupaten: string
        ktp_id_kecamatan: string
        ktp_id_kelurahan: string
        ktp_kode_pos: string
        ktp_rt: string
        ktp_rw: string
        alamat_lengkap: string
        id_provinsi: string
        id_kabupaten: string
        id_kecamatan: string
        id_kelurahan: string
        kode_pos: string
        rt: string
        rw: string
        no_hp: string
        no_telpon: string
        pendidikan_terakhir: string
        pekerjaan: string
        status_pernikahan: string
        methode_pembayaran: string
    }

    export interface UpdatePasien {
        nik: string
        wna: string
        is_pasien_bayi: boolean
        nama_lengkap: string
        nama_ibu_kandung: string
        tempat_lahir: string
        tanggal_lahir: string
        jenis_kelamin: string
        ktp_alamat_lengkap: string
        ktp_id_provinsi: string
        ktp_id_kabupaten: string
        ktp_id_kecamatan: string
        ktp_id_kelurahan: string
        ktp_kode_pos: string
        ktp_rt: string
        ktp_rw: string
        alamat_lengkap: string
        id_provinsi: string
        id_kabupaten: string
        id_kecamatan: string
        id_kelurahan: string
        kode_pos: string
        rt: string
        rw: string
        no_hp: string
        no_telpon: string
        pendidikan_terakhir: string
        pekerjaan: string
        status_pernikahan: string
        methode_pembayaran: string
    }
}