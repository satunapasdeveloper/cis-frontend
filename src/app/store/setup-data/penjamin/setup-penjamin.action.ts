import { PenjaminModel } from "src/app/model/pages/setup-data/penjamin.model";

export namespace SetupPenjaminActions {
    export class GetAllPenjamin {
        static readonly type = '[PENJAMIN] Get All Penjamin';
    }

    export class GetByIdPenjamin {
        static readonly type = '[PENJAMIN] Get By Id Penjamin';
        constructor(public payload: string) { }
    }

    export class CreatePenjamin {
        static readonly type = '[PENJAMIN] Create Penjamin';
        constructor(public payload: PenjaminModel.CreatePenjamin) { }
    }

    export class UpdatePenjamin {
        static readonly type = '[PENJAMIN] Update Penjamin';
        constructor(public payload: PenjaminModel.UpdatePenjamin) { }
    }

    export class UpdateStatusPenjamin {
        static readonly type = '[PENJAMIN] Update Status Penjamin';
        constructor(public payload: string) { }
    }

    export class DeletePenjamin {
        static readonly type = '[PENJAMIN] Delete Penjamin';
        constructor(public payload: string) { }
    }
}