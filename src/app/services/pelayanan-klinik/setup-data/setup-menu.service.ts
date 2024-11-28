import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { MenuModel } from 'src/app/model/pages/setup-data/menu.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupMenuService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<MenuModel.GetAllMenu> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-menu/getAll`, { page: 1, count: 1000 })
    }

    getAllActive(): Observable<MenuModel.GetAllMenu> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-menu/getForLookUp`, { page: 1, count: 1000 })
    }

    getById(id_menu: string): Observable<MenuModel.GetByIdMenu> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-menu/getById/${id_menu}`);
    }

    create(payload: MenuModel.CreateMenu): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_menu'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-menu/create`, payload);
    }

    update(payload: MenuModel.UpdateMenu): Observable<HttpBaseResponse> {
        const { id_menu, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-menu/update/${id_menu}`, data);
    }

    updateStatus(payload: MenuModel.UpdateMenu): Observable<HttpBaseResponse> {
        const { id_menu, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-menu/update/${id_menu}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_menu: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-menu/delete/${id_menu}`);
    }
}
