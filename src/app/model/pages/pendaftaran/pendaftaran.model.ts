import { HttpBaseResponse } from "../../http/http-request.model"

export namespace PendaftaranModel {
    export interface IJadwalDokter {
        id_jadwal_dokter: string
        id_hari: number
        jam_mulai: string
        jam_selesai: string
        nama: string
    }

    export class GetAllJadwalDokter implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IJadwalDokter[]
    }

    export interface CreatePendaftaran {
        id_pasien: string
        debitur: string
        tanggal_visit: string
        id_poli: number
        id_jadwal_dokter: number
    }
}