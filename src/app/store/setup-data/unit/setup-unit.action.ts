import { UnitModel } from "src/app/model/pages/setup-data/unit.model";

export namespace SetupUnitActions {
    export class GetAllUnit {
        static readonly type = '[UNIT] Get All Unit';
        constructor(public payload: UnitModel.IUnitQueryParams) { }
    }

    export class GetAllActiveUnit {
        static readonly type = '[UNIT] Get All Active Unit';
        constructor(public payload: UnitModel.IUnitQueryParams) { }
    }

    export class GetByIdUnit {
        static readonly type = '[UNIT] Get By Id Unit';
        constructor(public payload: string) { }
    }

    export class CreateUnit {
        static readonly type = '[UNIT] Create Unit';
        constructor(public payload: UnitModel.CreateUnit) { }
    }

    export class UpdateUnit {
        static readonly type = '[UNIT] Update Unit';
        constructor(public payload: UnitModel.UpdateUnit) { }
    }

    export class UpdateStatusUnit {
        static readonly type = '[UNIT] Update Status Unit';
        constructor(public payload: UnitModel.UpdateUnit) { }
    }

    export class DeleteUnit {
        static readonly type = '[UNIT] Delete Unit';
        constructor(public payload: string) { }
    }
}