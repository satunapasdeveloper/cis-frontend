import { ItemModel } from "src/app/model/pages/setup-data/item.model";

export namespace SetupItemActions {
    export class GetAllItem {
        static readonly type = '[ITEM] Get All Item';
        constructor(public payload: ItemModel.IItemParams) { }
    }

    export class GetAllActiveItem {
        static readonly type = '[ITEM] Get All Active Item';
        constructor(public payload: ItemModel.IItemParams) { }
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
        constructor(public payload: ItemModel.UpdateItem) { }
    }
}