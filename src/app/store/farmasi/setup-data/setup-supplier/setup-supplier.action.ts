import { SupplierModel } from "src/app/model/pages/farmasi/setup-data/setup-supplier.model";

export namespace SetupSupplierActions {
    export class GetAllSupplier {
        static readonly type = '[SETUP SUPPLIER] Get All Supplier';
        constructor(public payload: SupplierModel.IQueryString) { }
    }

    export class CreateSupplier {
        static readonly type = '[SETUP SUPPLIER] Create Supplier';
        constructor(public payload: SupplierModel.CreateSupplier) { }
    }

    export class UpdateSupplier {
        static readonly type = '[SETUP SUPPLIER] Update Supplier';
        constructor(public payload: SupplierModel.UpdateSupplier) { }
    }

    export class DeleteSupplier {
        static readonly type = '[SETUP SUPPLIER] Delete Supplier';
        constructor(public payload: string) { }
    }
}