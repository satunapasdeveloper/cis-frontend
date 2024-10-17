import { GolonganModel } from "src/app/model/pages/farmasi/setup-data/setup-golongan.model";

export namespace SetupGolonganActions {
    export class GetAllGolongan {
        static readonly type = '[SETUP GOLONGAN] Get All Golongan';
        constructor(public payload: GolonganModel.IQueryString) { }
    }

    export class CreateGolongan {
        static readonly type = '[SETUP GOLONGAN] Create Golongan';
        constructor(public payload: GolonganModel.CreateGolongan) { }
    }

    export class UpdateGolongan {
        static readonly type = '[SETUP GOLONGAN] Update Golongan';
        constructor(public payload: GolonganModel.UpdateGolongan) { }
    }

    export class DeleteGolongan {
        static readonly type = '[SETUP GOLONGAN] Delete Golongan';
        constructor(public payload: string) { }
    }
}