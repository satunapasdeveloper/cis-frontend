import { RekananPenunjangModel } from "src/app/model/pages/setup-data/rekanan-penunjang.model";

export namespace RekananPenunjangActions {
    export class GetAllRekananPenunjang {
        static readonly type = '[REKANAN PENUNJANG] Get All Rekanan Penunjang';
    }

    export class CreateRekananPenunjang {
        static readonly type = '[REKANAN PENUNJANG] Create Rekanan Penunjang';
        constructor(public payload: RekananPenunjangModel.CreateRekananPenunjang) { }
    }

    export class UpdateRekananPenunjang {
        static readonly type = '[REKANAN PENUNJANG] Update Rekanan Penunjang';
        constructor(public payload: RekananPenunjangModel.UpdateRekananPenunjang) { }
    }

    export class DeleteRekananPenunjang {
        static readonly type = '[REKANAN PENUNJANG] Delete Rekanan Penunjang';
        constructor(public payload: string) { }
    }
}