import { HttpBaseResponse } from "../../http/http-request.model"

export namespace AuthenticationModel {
    export interface IAuthentication {
        nama: string
        username: string
        layanan: string
        host: string
        token: string
    }

    export interface ISidebarMenu {
        id: string;
        caption: string;
        icon: string;
        toggle_child: boolean;
        url?: string;
        sidebarChild?: ISidebarMenu[]
    }

    export interface ISignIn {
        username: string
        password: string
    }

    export class SignIn implements HttpBaseResponse {
        responseResult!: boolean
        statusCode!: number
        message!: string
        data!: IAuthentication
    }
}