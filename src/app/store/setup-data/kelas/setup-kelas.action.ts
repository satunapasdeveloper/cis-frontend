import { KelasModel } from "src/app/model/pages/setup-data/kelas.model";

export namespace SetupKelasActions {
    export class GetAllKelas {
        static readonly type = '[KELAS] Get All Kelas';
    }

    export class GetByIdKelas {
        static readonly type = '[KELAS] Get By Id Kelas';
        constructor(public payload: string) { }
    }

    export class CreateKelas {
        static readonly type = '[KELAS] Create Kelas';
        constructor(public payload: KelasModel.CreateKelas) { }
    }

    export class UpdateKelas {
        static readonly type = '[KELAS] Update Kelas';
        constructor(public payload: KelasModel.UpdateKelas) { }
    }

    export class UpdateStatusKelas {
        static readonly type = '[KELAS] Update Status Kelas';
        constructor(public payload: string) { }
    }

    export class DeleteKelas {
        static readonly type = '[KELAS] Delete Kelas';
        constructor(public payload: string) { }
    }
}