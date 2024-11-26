import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { RoleModel } from 'src/app/model/pages/setup-data/role.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: RoleModel.IRoleQueryParams): Observable<RoleModel.GetAllRole> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-role/getAll`, query);
    }

    getAllActive(query: RoleModel.IRoleQueryParams): Observable<RoleModel.GetAllRole> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-role/getForLookUp`, query);
    }

    getById(id_role: string): Observable<RoleModel.GetByIdRole> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-role/getById/${id_role}`);
    }

    create(payload: RoleModel.CreateRole): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_role'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-role/create`, payload);
    }

    update(payload: RoleModel.UpdateRole): Observable<HttpBaseResponse> {
        const { id_role, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-role/update/${payload.id_role}`, data);
    }

    updateStatus(payload: RoleModel.UpdateRole): Observable<HttpBaseResponse> {
        const { id_role, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-role/update/${id_role}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_role: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-role/delete/${id_role}`);
    }
}
