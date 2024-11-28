import { HttpBaseResponse } from "../../http/http-request.model"

export namespace SettingRoleMenuModel {
    export interface ISettingRoleMenu {
        id_role: number
        nama_role: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: string
        role_menu: IRoleMenu[]
    }

    export interface IRoleMenu {
        id_role_menu: number
        id_role: number
        id_menu: number
        id_parent: number | null
        nama_parent: string | null
        caption: string;
        icon: string;
        url: string;
        is_assigned: boolean
        children: IRoleMenu[] | null
    }

    export class GetAllSettingRoleMenu implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: ISettingRoleMenu
    }

    export interface CreateSettingRoleMenu {
        id_role: number
        id_menu: number
    }
}