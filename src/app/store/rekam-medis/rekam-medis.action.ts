import { AnamesisModel } from "src/app/model/pages/rekam-medis/anamesis.model";
import { AssesmentModel } from "src/app/model/pages/rekam-medis/assesment.model";
import { DiagnosisModel } from "src/app/model/pages/rekam-medis/diagnosis.model";
import { PemeriksaanFisikModel } from "src/app/model/pages/rekam-medis/pemeriksaan-fisik.model";
import { KondisiPulangModel } from "src/app/model/pages/rekam-medis/pulang.model";
import { ResepModel } from "src/app/model/pages/rekam-medis/resep.model";
import { TindakanModel } from "src/app/model/pages/rekam-medis/tindakan.model";

export namespace RekamMedisActions {
    export class GetAllRekamMedis {
        static readonly type = '[REKAM MEDIS] Get All Rekam Medis';
        constructor(public payload: any[]) { }
    }

    export class GetByIdRekamMedis {
        static readonly type = '[REKAM MEDIS] Get By Id Pendaftaran';
        constructor(public payload: string) { }
    }

    export class GetAllVariableRekamMedis {
        static readonly type = '[REKAM MEDIS] Get All Variable';
    }

    export class GetResumeMedis {
        static readonly type = '[REKAM MEDIS] Get Resume Medis';
        constructor(public payload: string) { }
    }

    export class CreateAssessment {
        static readonly type = '[REKAM MEDIS] Create Assessment';
        constructor(public payload: AssesmentModel.IAssesment) { }
    }

    export class CreateAnamesis {
        static readonly type = '[REKAM MEDIS] Create Anamesis';
        constructor(public payload: AnamesisModel.CreateAnamesis) { }
    }

    export class CreatePemeriksaanFisik {
        static readonly type = '[REKAM MEDIS] Create Pemeriksaan Fisik';
        constructor(public payload: PemeriksaanFisikModel.CreatePemeriksaanFisik) { }
    }

    export class CreateDiagnosa {
        static readonly type = '[REKAM MEDIS] Create Diagnosa';
        constructor(public payload: DiagnosisModel.CreateDiagnosa) { }
    }

    export class CreateTindakan {
        static readonly type = '[REKAM MEDIS] Create Tindakan';
        constructor(public payload: TindakanModel.ITindakan) { }
    }

    export class CreateResep {
        static readonly type = '[REKAM MEDIS] Create Resep';
        constructor(public payload: ResepModel.IResep) { }
    }

    export class CreateStatusPulang {
        static readonly type = '[REKAM MEDIS] Create Status Pulang';
        constructor(public payload: KondisiPulangModel.IKondisiPulang) { }
    }

    export class GetTagihan {
        static readonly type = '[REKAM MEDIS] Get Tagihan';
        constructor(public payload: string) { }
    }

    export class CreateInvoice {
        static readonly type = '[REKAM MEDIS] Create Invoice';
        constructor(public payload: any) { }
    }

    export class GetHistoryPayment {
        static readonly type = '[REKAM MEDIS] Get History Payment';
        constructor(public payload: string) { }
    }

    export class CancelHistoryPayment {
        static readonly type = '[REKAM MEDIS] Cancel History Payment';
        constructor(public payload: string) { }
    }
}