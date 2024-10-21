import { ReturKonsinyasiModel } from "src/app/model/pages/farmasi/purchasing/retur-konsinyasi.model";

export namespace ReturKonsinyasiActions {
    export class GetAllReturKonsinyasi {
        static readonly type = '[RETUR KONSINYASI] Get All Retur Konsinyasi';
        constructor(public payload: ReturKonsinyasiModel.IQueryString) { }
    }

    export class GetByIdReturKonsinyasi {
        static readonly type = '[RETUR KONSINYASI] Get By Id Retur Konsinyasi';
        constructor(public payload: string) { }
    }

    export class CreateReturKonsinyasi {
        static readonly type = '[RETUR KONSINYASI] Create Retur Konsinyasi';
        constructor(public payload: ReturKonsinyasiModel.Create) { }
    }

    export class CancelReturKonsinyasi {
        static readonly type = '[RETUR KONSINYASI] Cancel Retur Konsinyasi';
        constructor(public payload: ReturKonsinyasiModel.Cancel) { }
    }

    export class ValidasiReturKonsinyasi {
        static readonly type = '[RETUR KONSINYASI] Validasi Retur Konsinyasi';
        constructor(public payload: string) { }
    }
}