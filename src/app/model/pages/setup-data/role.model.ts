import { HttpBaseResponse } from "../../http/http-request.model"

export namespace RoleModel {
    export interface IRole {
        id_role: string
        role: string
        status_aktif: string
    }

    export class GetAllRole implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRole[]
    }

    export class GetByIdRole implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IRole
    }

    export interface CreateRole {
        role: string
    }

    export interface UpdateRole {
        id_role: string
        role: string
    }
}