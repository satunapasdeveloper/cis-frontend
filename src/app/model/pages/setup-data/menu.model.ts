import { HttpBaseResponse } from "../../http/http-request.model"

export namespace MenuModel {
    export interface IMenu {
        id_menu: number
        urut: number
        caption: string
        icon: string
        toggle_child: boolean
        url: string
        id_parent: string | null
        is_parent: boolean
        is_active: boolean
        is_admin: boolean
        is_client: boolean
    }

    export class GetAllMenu implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IMenu[];
            totalRows: number;
        }
    }

    export class GetByIdMenu implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IMenu
    }

    export interface CreateMenu {
        urut: number
        caption: string
        icon: string
        toggle_child: boolean
        url: string
        id_parent: string | null
        is_parent: boolean
        is_admin: boolean
        is_client: boolean
    }

    export interface UpdateMenu {
        id_menu: number
        urut: number
        caption: string
        icon: string
        toggle_child: boolean
        url: string
        id_parent: number | null
        is_parent: boolean
        is_active: boolean
        is_admin: boolean
        is_client: boolean
    }
}