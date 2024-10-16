import { HttpBaseResponse } from "../../http/http-request.model"
import { AnamesisModel } from "./anamesis.model"
import { AssesmentModel } from "./assesment.model"
import { DiagnosisModel } from "./diagnosis.model"
import { PemeriksaanFisikModel } from "./pemeriksaan-fisik.model"
import { KondisiPulangModel } from "./pulang.model"
import { ResepModel } from "./resep.model"
import { TindakanModel } from "./tindakan.model"

export namespace RekamMedisModel {
    export interface IRekamMedis {
        id_pendaftaran: string
        id_pasien: string
        no_pendaftaran: string
        no_antrian: string
        angka_antrian: number
        tanggal_visit: string
        pre_assessment: boolean
        status_billing: boolean
        status_pasien: string
        status_pulang: any
        debitur: string
        created_at: string
        no_rekam_medis: string
        nama_lengkap: string
        nik: string
        id_dokter: string
        jam_mulai: string
        jam_selesai: string
        dokter: string
        poli: string
        assesment?: AssesmentModel.IAssesment
        anamnesis?: AnamesisModel.IAnamnesis
        pemeriksaan_fisik?: PemeriksaanFisikModel.IPemeriksaanFisik
        diagnosisi?: DiagnosisModel.IDiagnosisi | any
        tindakan?: TindakanModel.ITindakan
        resep?: ResepModel.IResep
        pulang?: KondisiPulangModel.IKondisiPulang
    }

    export class GetAllRekamMedis implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRekamMedis[]
    }

    export class GetByIdRekamMedis implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRekamMedis
    }

    export interface IKesadaran {
        value: string
        title: string
    }

    export interface IPernafasan {
        value: string
        title: string
    }

    export interface IResikoJatuh {
        value: string
        title: string
    }

    export interface INyeri {
        value: string
        title: string
    }

    export interface IBatuk {
        value: string
        title: string
    }

    export interface IWaktu {
        value: string
        title: string
    }

    export interface IWaktuSpesifik {
        value: string
        title: string
    }

    export interface IRutePemberian {
        value: string
        title: string
    }

    export interface IStatusPulang {
        value: string
        title: string
        image: string
    }

    export interface IVariableRekamMedis {
        kesadaran: IKesadaran[]
        pernafasan: IPernafasan[]
        resiko_jatuh: IResikoJatuh[]
        nyeri: INyeri[]
        batuk: IBatuk[]
        waktu: IWaktu[]
        waktu_spesifik: IWaktuSpesifik[]
        rute_pemberian: IRutePemberian[]
        status_pulang: IStatusPulang[]
    }

    export class GetAllRekamMedisVariable implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IVariableRekamMedis
    }
}