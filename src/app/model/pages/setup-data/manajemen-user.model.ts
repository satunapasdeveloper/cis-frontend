import { HttpBaseResponse } from "../../http/http-request.model"

export namespace ManajemenUserModel {
    export interface IRoleUser {
        id_role: number
        role: string
    }

    export class GetAllRole implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRoleUser[]
    }

    export interface IUser {
        username: string
        uuid: string
        his_number: string
        nik: string
        nama: string
        no_hp: string
        tanggal_lahir: string
        jenis_kelamin: string
        id_role: number
        id_poli: string
        is_active: boolean
        is_delete: boolean
        poli: string
        role: string
    }

    export class GetAllUser implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IUser[]
    }

    export class GetByIdUser implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IUser
    }

    export interface CreateUser {
        password: string
        his_number: string
        nik: string
        nama: string
        no_hp: string
        tanggal_lahir: string
        jenis_kelamin: string
        id_role: number
        id_poli: number
    }

    export interface UpdateUser {
        his_number: string
        nik: string
        nama: string
        no_hp: string
        tanggal_lahir: string
        jenis_kelamin: string
        id_role: number
        id_poli: number
        jadwal: any[] | null;
    }

    export interface UpdateUserDokter {
        his_number: string
        nik: string
        nama: string
        no_hp: string
        tanggal_lahir: string
        jenis_kelamin: string
        id_role: number
        id_poli: number
        jadwal: IJadwalDokter[];
    }

    export interface IJadwalDokter {
        id_hari: number
        hari: string
        jam_buka: IJamBukaDokter[]
    }

    export interface IJamBukaDokter {
        id_jadwal_dokter: string
        id_dokter: number
        id_hari: number
        jam_mulai: string
        jam_selesai: string
        urut: number
    }
}