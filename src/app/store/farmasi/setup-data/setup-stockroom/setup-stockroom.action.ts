import { StockroomModel } from "src/app/model/pages/inventory/setup-data/setup-stockroom.model";

export namespace SetupStockroomActions {
    export class GetAllStockroom {
        static readonly type = '[SETUP STOCKROOM] Get All Stockroom';
        constructor(public payload: StockroomModel.IQueryString) { }
    }

    export class CreateStockroom {
        static readonly type = '[SETUP STOCKROOM] Create Stockroom';
        constructor(public payload: StockroomModel.CreateStockroom) { }
    }

    export class UpdateStockroom {
        static readonly type = '[SETUP STOCKROOM] Update Stockroom';
        constructor(public payload: StockroomModel.UpdateStockroom) { }
    }

    export class UpdateStatusStockroom {
        static readonly type = '[SETUP STOCKROOM] Update Status Stockroom';
        constructor(public payload: StockroomModel.UpdateStockroom) { }
    }

    export class DeleteStockroom {
        static readonly type = '[SETUP STOCKROOM] Delete Stockroom';
        constructor(public payload: string) { }
    }
}