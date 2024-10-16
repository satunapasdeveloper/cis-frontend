export namespace PemeriksaanFisikModel {
    export interface IPemeriksaanFisik {
        id_pendaftaran: string
        tingkat_kesadaran: string
        status_psikologi: string
        tinggi_badan: number
        berat_badan: number
        sistole: number
        distole: number
        spO2: number
        suhu_tubuh: number
        denyut_nadi: number
        pernafasan_menit: number
        kondisi_tubuh: any[]
    }

    export interface CreatePemeriksaanFisik {
        id_pendaftaran: number
        tingkat_kesadaran: string
        status_psikologi: string
        tinggi_badan: number
        berat_badan: number
        sistole: number
        distole: number
        spO2: number
        suhu_tubuh: number
        denyut_nadi: number
        pernafasan_menit: number
        kondisi_tubuh: IKondisiTubuh[]
    }

    export interface IKondisiTubuh {
        anggota_tubuh: string
        kode_loinc: string
        display_loinc: string
        catatan_kondisi: string
    }

}