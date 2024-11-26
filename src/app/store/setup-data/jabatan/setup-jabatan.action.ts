import { JabatanModel } from "src/app/model/pages/setup-data/jabatan.model";

export namespace SetupJabatanActions {
    export class GetAllJabatan {
        static readonly type = '[JABATAN] Get All Jabatan';
        constructor(public payload: JabatanModel.IJabatanQueryParams) { }
    }

    export class GetAllActiveJabatan {
        static readonly type = '[JABATAN] Get All Active Jabatan';
        constructor(public payload: JabatanModel.IJabatanQueryParams) { }
    }

    export class GetByIdJabatan {
        static readonly type = '[JABATAN] Get By Id Jabatan';
        constructor(public payload: string) { }
    }

    export class CreateJabatan {
        static readonly type = '[JABATAN] Create Jabatan';
        constructor(public payload: JabatanModel.CreateJabatan) { }
    }

    export class UpdateJabatan {
        static readonly type = '[JABATAN] Update Jabatan';
        constructor(public payload: JabatanModel.UpdateJabatan) { }
    }

    export class UpdateStatusJabatan {
        static readonly type = '[JABATAN] Update Status Jabatan';
        constructor(public payload: string) { }
    }

    export class DeleteJabatan {
        static readonly type = '[JABATAN] Delete Jabatan';
        constructor(public payload: string) { }
    }
}