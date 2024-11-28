import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../http/http-request.service';
import { SettingRoleMenuModel } from 'src/app/model/pages/setup-data/setting-role.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, forkJoin, map, Observable, of } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class SettingRoleMenuService {

    RoleMenu$ = new BehaviorSubject<SettingRoleMenuModel.IRoleMenu[]>([]);

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_role: number): Observable<SettingRoleMenuModel.GetAllSettingRoleMenu> {
        const getAllMenu = this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-menu/getAll`, { page: 1, count: 1000 })
            .pipe(
                map((result) => {
                    return result.data.rows;
                })
            )

        const getAllRoleMenu = this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-role/getById/${id_role}`)
            .pipe(
                map((result) => {
                    return result.data.role_menu;
                })
            )

        const data: any = forkJoin([getAllMenu, getAllRoleMenu])
            .pipe(
                map((result) => {

                    let allMenu = result[0], roleMenu = result[1], filteredMenu: any[] = [];

                    // Map roleMenu to a dictionary for faster lookup
                    const roleMenuMap: any = new Map(
                        roleMenu.map((item: any) => [item.id_menu, item])
                    );

                    // Merge the arrays with the desired structure
                    filteredMenu = allMenu.map((menu: any) => {
                        const assignedRole = roleMenuMap.get(menu.id_menu);
                        return {
                            id_role_menu: assignedRole ? assignedRole.id_role_menu : null,
                            id_role: id_role,
                            id_menu: menu.id_menu,
                            id_parent: menu.id_parent ? menu.id_parent : null,
                            nama_parent: menu.parent ? menu.parent.caption : null,
                            caption: menu.caption,
                            icon: menu.icon,
                            url: menu.url,
                            is_assigned: !!assignedRole,
                            toggle_children: false,
                            children: []
                        };
                    });

                    const menuMap = new Map<number, any>();

                    // Populate menuMap for quick access
                    filteredMenu.forEach((menu) => {
                        menuMap.set(menu.id_menu, menu);
                    });

                    const nestedMenu: any[] = [];
                    filteredMenu.forEach((menu) => {
                        if (menu.id_parent) {
                            let parent: any = menuMap.get(menu.id_parent);
                            if (parent) {
                                parent.children.push(menu); // Safely push to children
                            } else {
                                console.warn(`Parent with id_menu ${menu.id_parent} not found for menu ${menu.id_menu}`);
                            }
                        } else {
                            nestedMenu.push(menu);
                        }
                    });


                    return { responseResult: true, statusCode: 200, message: "", data: nestedMenu };
                })
            );

        return data;
    }

    create(payload: SettingRoleMenuModel.CreateSettingRoleMenu): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-role/createRoleMenu`, payload)
    }

    delete(id_role_menu: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-role/removeRoleMenu/${id_role_menu}`)
    }
}
