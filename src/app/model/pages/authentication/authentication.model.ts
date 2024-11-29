import { HttpBaseResponse } from "../../http/http-request.model"

export namespace AuthenticationModel {
    export interface IAuthentication {
        nama: string
        username: string
        nama_jabatan: string
        nama_poli: string
        id_role: number;
        nama_role: string
        access_token: string
    }

    export interface INavbarMenu {
        id: string;
        caption: string;
        icon: string;
    }

    export interface ISidebarMenu {
        id: string;
        navbar_id?: string;
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