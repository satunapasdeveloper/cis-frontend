export namespace AssesmentModel {
    export interface IAssesment {
        id_pendaftaran: number
        kesadaran: string
        pernafasan: string
        resiko_jatuh: string
        nyeri: string
        batuk: string
        tinggi_badan: number
        berat_badan: number
        sistole: number
        distole: number
        spO2: number
        suhu_tubuh: number
        denyut_nadi: number
        pernafasan_menit: number
    }
}