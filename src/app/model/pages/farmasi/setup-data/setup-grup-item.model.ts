import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace GroupItemModel {
    export interface IGroupItem {
        id_item_grup: number
        kode_grup: string
        nama_grup: string
        is_active: boolean
        created_at: string
        created_by: string
        updated_at: string
        updated_by: any
    }

    export interface IGroupItemQueryParams {
        page: number;
        count: number;
        nama_grup?: string
    }

    export class GetAllGroupItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IGroupItem[];
            totalRows: number;
        }
    }

    export class GetByIdGroupItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IGroupItem
    }

    export interface CreateGroupItem {
        kode_grup: string
        nama_grup: string
    }

    export interface UpdateGroupItem {
        id_item_grup: number
        kode_grup: string
        nama_grup: string
        is_active: boolean
    }
}