import { ItemModel } from "src/app/model/pages/setup-data/item.model";

export namespace SetupItemActions {
    export class GetAllItem {
        static readonly type = '[ITEM] Get All Item';
    }

    export class GetByIdItem {
        static readonly type = '[ITEM] Get By Id Item';
        constructor(public payload: string) { }
    }

    export class CreateItem {
        static readonly type = '[ITEM] Create Item';
        constructor(public payload: ItemModel.CreateItem) { }
    }

    export class UpdateItem {
        static readonly type = '[ITEM] Update Item';
        constructor(public payload: ItemModel.UpdateItem) { }
    }

    export class UpdateStatusItem {
        static readonly type = '[ITEM] Update Status Item';
        constructor(public payload: string) { }
    }

    export class DeleteItem {
        static readonly type = '[ITEM] Delete Item';
        constructor(public payload: string) { }
    }
}