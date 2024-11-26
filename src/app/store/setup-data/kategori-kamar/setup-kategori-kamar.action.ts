import { KategoriKamarModel } from "src/app/model/pages/setup-data/kategori-kamar.model";

export namespace SetupKategoriKamarActions {
    export class GetAllKategoriKamar {
        static readonly type = '[KATEGORI KAMAR] Get All Kategori Kamar';
        constructor(public payload: KategoriKamarModel.IKategoriKamarQueryParams) { }
    }

    export class GetAllActiveKategoriKamar {
        static readonly type = '[KATEGORI KAMAR] Get All Active Kategori Kamar';
        constructor(public payload: KategoriKamarModel.IKategoriKamarQueryParams) { }
    }

    export class GetByIdKategoriKamar {
        static readonly type = '[KATEGORI KAMAR] Get By Id Kategori Kamar';
        constructor(public payload: string) { }
    }

    export class CreateKategoriKamar {
        static readonly type = '[KATEGORI KAMAR] Create KategoriKamar';
        constructor(public payload: KategoriKamarModel.CreateKategoriKamar) { }
    }

    export class UpdateKategoriKamar {
        static readonly type = '[KATEGORI KAMAR] Update Kategori Kamar';
        constructor(public payload: KategoriKamarModel.UpdateKategoriKamar) { }
    }

    export class UpdateStatusKategoriKamar {
        static readonly type = '[KATEGORI KAMAR] Update Status Kategori Kamar';
        constructor(public payload: string) { }
    }

    export class DeleteKategoriKamar {
        static readonly type = '[KATEGORI KAMAR] Delete Kategori Kamar';
        constructor(public payload: string) { }
    }
}