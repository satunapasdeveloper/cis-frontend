import { HttpBaseResponse } from "../../http/http-request.model"

export namespace RoleModel {
    export interface IRole {
        id_role: string
        nama_role: string
        is_active: boolean;
    }

    export interface IRoleQueryParams {
        page: number;
        count: number;
        nama_role?: string;
    }

    export class GetAllRole implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: {
            page: string;
            rows: IRole[];
            totalRows: number;
        }
    }

    export class GetByIdRole implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRole
    }

    export interface CreateRole {
        nama_role: string
    }

    export interface UpdateRole {
        id_role: string
        nama_role: string
        is_active: boolean;
    }
}