import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace PendaftaranRawatJalanModel {
    export interface IListPendaftaran {
        id_register: string
        no_antrian: string
        no_register: string
        id_pasien: string
        no_rekam_medis: string
        nama_pasien: string
        gender: string
        tanggal_lahir: string
        jenis_rawat: string
        tanggal_admisi: string
        tanggal_pulang: string
        id_poli: number
        kode_poli: string
        nama_poli: string
        id_jadwal_dokter: string
        id_dokter: string
        nama_dokter: string
        kode_dpjp: string
        id_penjamin: number
        nama_penjamin: string
        id_asal_rujukan: number
        asal_rujukan: string
        id_kelas_rawat: number
        nama_kelas: string
        kode_kelas: string
        id_kondisi_pulang: string
        kondisi_pulang: string
        id_cara_pulang: string
        cara_pulang: string
        time_pulang: string
        status_bpjs: string
        created_at: string
        created_by: string
        updated_at: string
        updated_by: string
        closed_bill_at: string
        closed_bill_by: string
        canceled_at: string
        canceled_by: string
        reason_canceled: string
        log_cek_bpjs: ILogCekBpj[]
        status_register: string
    }

    export interface ILogCekBpj {
        title: string
        message: string
        status: number
    }

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
        golongan_darah: string
        nama_ibu_kandung: string
        nik_ibu_kandung: any
        identitas_lain: any
        no_identitas_lain: any
        file_foto_nama: any
        file_foto_url: string
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
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: string
    }

    export interface IPoli {
        id_poli: number
        id_unit: number
        kode_poli: string
        nama_poli: string
        kode_poli_bpjs: string
        id_poli_satu_sehat: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: string
    }

    export interface IJadwalDokter {
        id_nakes_jadwal: string
        id_nakes: number
        id_hari: number
        jam_mulai: string
        jam_selesai: string
        urut: number
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IDokter {
        id_nakes: number
        nik: string
        nama: string
        file_foto_name: any
        file_foto_url: any
        id_jabatan: number
        id_poli: number
        id_role: number
        username: string
        password: string
        kode_dpjp: string
        id_satu_sehat: any
        hfis: any
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: string
    }

    export interface IPenjamin {
        id_penjamin: number
        nama_penjamin: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IAsalRujukan {
        id_asal_rujukan: number
        asal_rujukan: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IKelasRawat {
        id_kelas: number
        nama_kelas: string
        kode_kelas: string
        kode_kelas_bpjs: string
        id_kelas_satu_sehat: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IListPendaftaranQueryParams {
        page: number;
        count: number;
        tanggal_admisi?: string;
        id_poli?: string;
        id_dokter?: string;
        nama_pasien?: string;
    }

    export class GetAllPendaftaran implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IListPendaftaran[];
            totalRows: number;
        }
    }
}