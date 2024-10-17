import { PabrikModel } from "src/app/model/pages/farmasi/setup-data/setup-pabrik.model";

export namespace SetupPabrikActions {
    export class GetAllPabrik {
        static readonly type = '[SETUP PABRIK] Get All Pabrik';
        constructor(public payload: PabrikModel.IQueryString) { }
    }

    export class CreatePabrik {
        static readonly type = '[SETUP PABRIK] Create Pabrik';
        constructor(public payload: PabrikModel.CreatePabrik) { }
    }

    export class UpdatePabrik {
        static readonly type = '[SETUP PABRIK] Update Pabrik';
        constructor(public payload: PabrikModel.UpdatePabrik) { }
    }

    export class DeletePabrik {
        static readonly type = '[SETUP PABRIK] Delete Pabrik';
        constructor(public payload: string) { }
    }
}