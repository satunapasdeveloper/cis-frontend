import { PurchasingOrderModel } from "src/app/model/pages/farmasi/purchasing-order/purchasing-order.model";

export namespace PurchasingOrderActions {
    export class GetAllPurchasingOrder {
        static readonly type = '[PURCHASING ORDER] Get All Purchasing Order';
        constructor(public payload: PurchasingOrderModel.IQueryString) { }
    }

    export class GetByIdPurchasingOrder {
        static readonly type = '[PURCHASING ORDER] Get By Id Purchasing Order';
        constructor(public payload: string) { }
    }

    export class CreatePurchasingOrder {
        static readonly type = '[PURCHASING ORDER] Create Purchasing Order';
        constructor(public payload: PurchasingOrderModel.Create) { }
    }

    export class CancelPurchasingOrder {
        static readonly type = '[PURCHASING ORDER] Cancel Purchasing Order';
        constructor(public payload: PurchasingOrderModel.Cancel) { }
    }

    export class ValidasiPurchasingOrder {
        static readonly type = '[PURCHASING ORDER] Validasi Purchasing Order';
        constructor(public payload: string) { }
    }
}