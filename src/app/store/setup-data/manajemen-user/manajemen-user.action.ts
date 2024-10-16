import { ManajemenUserModel } from "src/app/model/pages/setup-data/manajemen-user.model";

export namespace ManajemenUserActions {
    export class GetAllUser {
        static readonly type = '[User] Get All User';
    }

    export class GetAllUserDokter {
        static readonly type = '[User] Get All User Dokter';
    }

    export class GetByIdUser {
        static readonly type = '[User] Get By Id User';
        constructor(public payload: string) { }
    }

    export class CreateUser {
        static readonly type = '[User] Create User';
        constructor(public payload: ManajemenUserModel.CreateUser) { }
    }

    export class UpdateUser {
        static readonly type = '[User] Update User';
        constructor(public uuid: string, public payload: ManajemenUserModel.UpdateUser) { }
    }

    export class UpdateUserDokter {
        static readonly type = '[User] Update User Dokter';
        constructor(public uuid: string, public payload: ManajemenUserModel.UpdateUser) { }
    }

    export class UpdateStatusUser {
        static readonly type = '[User] Update Status User';
        constructor(public payload: string) { }
    }

    export class DeleteUser {
        static readonly type = '[User] Delete User';
        constructor(public payload: string) { }
    }
}