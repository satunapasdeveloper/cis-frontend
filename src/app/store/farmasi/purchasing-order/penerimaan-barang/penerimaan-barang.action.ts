import { PenerimaanBarangModel } from "src/app/model/pages/farmasi/purchasing/penerimaan-barang.model";

export namespace PenerimaanBarangActions {
    export class GetAllPenerimaanBarang {
        static readonly type = '[PENERIMAAN BARANG] Get All Penerimaan Barang';
        constructor(public payload: PenerimaanBarangModel.IQueryString) { }
    }

    export class GetByIdPenerimaanBarang {
        static readonly type = '[PENERIMAAN BARANG] Get By Id Penerimaan Barang';
        constructor(public payload: string) { }
    }

    export class CreatePenerimaanBarang {
        static readonly type = '[PENERIMAAN BARANG] Create Penerimaan Barang';
        constructor(public payload: PenerimaanBarangModel.Create) { }
    }

    export class CancelPenerimaanBarang {
        static readonly type = '[PENERIMAAN BARANG] Cancel Penerimaan Barang';
        constructor(public payload: PenerimaanBarangModel.Cancel) { }
    }

    export class ValidasiPenerimaanBarang {
        static readonly type = '[PENERIMAAN BARANG] Validasi Penerimaan Barang';
        constructor(public payload: string) { }
    }
}