import { PenerimaanKonsinyasiModel } from "src/app/model/pages/farmasi/purchasing/penerimaan-konsinyasi.model";

export namespace PenerimaanKonsinyasiActions {
    export class GetAllPenerimaanKonsinyasi {
        static readonly type = '[PENERIMAAN KONSINYASI] Get All Penerimaan Konsinyasi';
        constructor(public payload: PenerimaanKonsinyasiModel.IQueryString) { }
    }

    export class GetByIdPenerimaanKonsinyasi {
        static readonly type = '[PENERIMAAN KONSINYASI] Get By Id Penerimaan Konsinyasi';
        constructor(public payload: string) { }
    }

    export class CreatePenerimaanKonsinyasi {
        static readonly type = '[PENERIMAAN KONSINYASI] Create Penerimaan Konsinyasi';
        constructor(public payload: PenerimaanKonsinyasiModel.Create) { }
    }

    export class CancelPenerimaanKonsinyasi {
        static readonly type = '[PENERIMAAN KONSINYASI] Cancel Penerimaan Konsinyasi';
        constructor(public payload: PenerimaanKonsinyasiModel.Cancel) { }
    }

    export class ValidasiPenerimaanKonsinyasi {
        static readonly type = '[PENERIMAAN KONSINYASI] Validasi Penerimaan Konsinyasi';
        constructor(public payload: string) { }
    }
}