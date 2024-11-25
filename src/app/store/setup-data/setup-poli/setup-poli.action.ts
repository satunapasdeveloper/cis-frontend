import { PoliModel } from "src/app/model/pages/setup-data/poli.model";

export namespace SetupPoliActions {
    export class GetAllPoli {
        static readonly type = '[POLI] Get All Poli';
        constructor(public payload: PoliModel.IPoliQueryParams) { }
    }

    export class GetAllActivePoli {
        static readonly type = '[POLI] Get All Active Poli';
        constructor(public payload: PoliModel.IPoliQueryParams) { }
    }

    export class CreatePoli {
        static readonly type = '[POLI] Create Poli';
        constructor(public payload: PoliModel.CreatePoli) { }
    }

    export class UpdatePoli {
        static readonly type = '[POLI] Update Poli';
        constructor(public payload: PoliModel.UpdatePoli) { }
    }

    export class UpdateStatusPoli {
        static readonly type = '[POLI] Update Poli';
        constructor(public payload: PoliModel.UpdatePoli) { }
    }

    export class DeletePoli {
        static readonly type = '[POLI] Delete Poli';
        constructor(public payload: string) { }
    }
}