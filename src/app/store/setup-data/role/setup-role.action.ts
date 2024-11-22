import { RoleModel } from "src/app/model/pages/setup-data/role.model";

export namespace SetupRoleActions {
    export class GetAllRole {
        static readonly type = '[UNIT] Get All Role';
    }

    export class GetByIdRole {
        static readonly type = '[UNIT] Get By Id Role';
        constructor(public payload: string) { }
    }

    export class CreateRole {
        static readonly type = '[UNIT] Create Role';
        constructor(public payload: RoleModel.CreateRole) { }
    }

    export class UpdateRole {
        static readonly type = '[UNIT] Update Role';
        constructor(public payload: RoleModel.UpdateRole) { }
    }

    export class UpdateStatusRole {
        static readonly type = '[UNIT] Update Status Role';
        constructor(public payload: string) { }
    }

    export class DeleteRole {
        static readonly type = '[UNIT] Delete Role';
        constructor(public payload: string) { }
    }
}