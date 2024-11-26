import { RoleModel } from "src/app/model/pages/setup-data/role.model";

export namespace SetupRoleActions {
    export class GetAllRole {
        static readonly type = '[ROLE] Get All Role';
        constructor(public payload: RoleModel.IRoleQueryParams) { }
    }

    export class GetAllActiveRole {
        static readonly type = '[ROLE] Get All Active Role';
        constructor(public payload: RoleModel.IRoleQueryParams) { }
    }

    export class GetByIdRole {
        static readonly type = '[ROLE] Get By Id Role';
        constructor(public payload: string) { }
    }

    export class CreateRole {
        static readonly type = '[ROLE] Create Role';
        constructor(public payload: RoleModel.CreateRole) { }
    }

    export class UpdateRole {
        static readonly type = '[ROLE] Update Role';
        constructor(public payload: RoleModel.UpdateRole) { }
    }

    export class UpdateStatusRole {
        static readonly type = '[ROLE] Update Status Role';
        constructor(public payload: string) { }
    }

    export class DeleteRole {
        static readonly type = '[ROLE] Delete Role';
        constructor(public payload: string) { }
    }
}