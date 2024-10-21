import { ReturPembelianModel } from "src/app/model/pages/farmasi/purchasing/retur-penerimaan.model";

export namespace ReturPembelianActions {
    export class GetAllReturPembelian {
        static readonly type = '[RETUR PEMBELIAN] Get All Retur Pembelian';
        constructor(public payload: ReturPembelianModel.IQueryString) { }
    }

    export class GetByIdReturPembelian {
        static readonly type = '[RETUR PEMBELIAN] Get By Id Retur Pembelian';
        constructor(public payload: string) { }
    }

    export class CreateReturPembelian {
        static readonly type = '[RETUR PEMBELIAN] Create Retur Pembelian';
        constructor(public payload: ReturPembelianModel.Create) { }
    }

    export class CancelReturPembelian {
        static readonly type = '[RETUR PEMBELIAN] Cancel Retur Pembelian';
        constructor(public payload: ReturPembelianModel.Cancel) { }
    }

    export class ValidasiReturPembelian {
        static readonly type = '[RETUR PEMBELIAN] Validasi Retur Pembelian';
        constructor(public payload: string) { }
    }
}