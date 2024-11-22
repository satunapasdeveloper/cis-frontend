import { KamarModel } from "src/app/model/pages/setup-data/kamar.model";

export namespace SetupKamarActions {
    export class GetAllKamar {
        static readonly type = '[KAMAR] Get All Kamar';
    }

    export class GetByIdKamar {
        static readonly type = '[KAMAR] Get By Id Kamar';
        constructor(public payload: string) { }
    }

    export class CreateKamar {
        static readonly type = '[KAMAR] Create Kamar';
        constructor(public payload: KamarModel.CreateKamar) { }
    }

    export class UpdateKamar {
        static readonly type = '[KAMAR] Update Kamar';
        constructor(public payload: KamarModel.UpdateKamar) { }
    }

    export class UpdateStatusKamar {
        static readonly type = '[KAMAR] Update Status Kamar';
        constructor(public payload: string) { }
    }

    export class DeleteKamar {
        static readonly type = '[KAMAR] Delete Kamar';
        constructor(public payload: string) { }
    }
}