import { PoliModel } from "src/app/model/pages/setup-data/poli.model";

export namespace SetupPoliActions {
    export class GetAllPoli {
        static readonly type = '[SETUP POLI] Get All Poli';
    }

    export class CreatePoli {
        static readonly type = '[SETUP POLI] Create Tindakan Medis';
        constructor(public payload: PoliModel.CreatePoli) { }
    }

    export class UpdatePoli {
        static readonly type = '[SETUP POLI] Update Tindakan Medis';
        constructor(public payload: PoliModel.UpdatePoli) { }
    }

    export class DeletePoli {
        static readonly type = '[SETUP POLI] Delete Tindakan Medis';
        constructor(public payload: string) { }
    }
}