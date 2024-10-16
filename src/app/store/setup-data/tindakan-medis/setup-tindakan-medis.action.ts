import { TindakanMedisModel } from "src/app/model/pages/setup-data/tindakan-medis.model";

export namespace SetupTindakanMedisActions {
    export class GetAllTindakanMedis {
        static readonly type = '[TindakanMedis] Get All Tindakan Medis';
    }

    export class GetByIdTindakanMedis {
        static readonly type = '[TindakanMedis] Get By Id Tindakan Medis';
        constructor(public payload: string) { }
    }

    export class CreateTindakanMedis {
        static readonly type = '[TindakanMedis] Create Tindakan Medis';
        constructor(public payload: TindakanMedisModel.CreateTindakanMedis) { }
    }

    export class UpdateTindakanMedis {
        static readonly type = '[TindakanMedis] Update Tindakan Medis';
        constructor(public payload: TindakanMedisModel.UpdateTindakanMedis) { }
    }

    export class UpdateStatusTindakanMedis {
        static readonly type = '[TindakanMedis] Update Status Tindakan Medis';
        constructor(public payload: string) { }
    }

    export class DeleteTindakanMedis {
        static readonly type = '[TindakanMedis] Delete Tindakan Medis';
        constructor(public payload: string) { }
    }
}