import { BedModel } from "src/app/model/pages/setup-data/bed.model";

export namespace SetupBedActions {
    export class GetAllBed {
        static readonly type = '[BED] Get All Bed';
    }

    export class GetByIdBed {
        static readonly type = '[BED] Get By Id Bed';
        constructor(public payload: string) { }
    }

    export class CreateBed {
        static readonly type = '[BED] Create Bed';
        constructor(public payload: BedModel.CreateBed) { }
    }

    export class UpdateBed {
        static readonly type = '[BED] Update Bed';
        constructor(public payload: BedModel.UpdateBed) { }
    }

    export class UpdateStatusBed {
        static readonly type = '[BED] Update Status Bed';
        constructor(public payload: string) { }
    }

    export class DeleteBed {
        static readonly type = '[BED] Delete Bed';
        constructor(public payload: string) { }
    }
}