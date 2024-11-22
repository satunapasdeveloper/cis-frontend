import { NakesModel } from "src/app/model/pages/setup-data/nakes.model";

export namespace SetupNakesActions {
    export class GetAllNakes {
        static readonly type = '[NAKES] Get All Nakes';
    }

    export class GetByIdNakes {
        static readonly type = '[NAKES] Get By Id Nakes';
        constructor(public payload: string) { }
    }

    export class CreateNakes {
        static readonly type = '[NAKES] Create Nakes';
        constructor(public payload: NakesModel.CreateNakes) { }
    }

    export class UpdateNakes {
        static readonly type = '[NAKES] Update Nakes';
        constructor(public payload: NakesModel.UpdateNakes) { }
    }

    export class UpdateStatusNakes {
        static readonly type = '[NAKES] Update Status Nakes';
        constructor(public payload: string) { }
    }

    export class DeleteNakes {
        static readonly type = '[NAKES] Delete Nakes';
        constructor(public payload: string) { }
    }
}