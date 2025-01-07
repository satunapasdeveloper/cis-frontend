import { HttpBaseResponse } from "src/app/model/http/http-request.model"

export namespace JenisItemModel {
    export interface IJenisItem {
        id_item_jenis: number
        id_item: number
        jenis: string
        is_active: boolean
    }

    export interface IJenisItemQueryParams {
        page: number;
        count: number;
        jenis?: string
    }

    export class GetAllJenisItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IJenisItem[];
            totalRows: number;
        }
    }

    export class GetByIdJenisItem implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IJenisItem
    }

    export interface CreateJenisItem {
        jenis: string
    }

    export interface UpdateJenisItem {
        id_item_jenis: number
        jenis: string
        is_active: boolean
    }
}