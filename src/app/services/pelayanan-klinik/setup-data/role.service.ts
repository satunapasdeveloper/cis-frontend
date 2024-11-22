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

    getAll(): Observable<RoleModel.GetAllRole> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Role/GetAll`);
    }

    getById(id_role: string): Observable<RoleModel.GetByIdRole> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Role/GetByUuid/${id_role}`);
    }

    create(payload: RoleModel.CreateRole): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_role'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Role/Create`, payload);
    }

    update(payload: RoleModel.UpdateRole): Observable<HttpBaseResponse> {
        const { id_role, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Role/Update/${payload.id_role}`, data);
    }

    updateStatus(id_role: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Role/UpdateStatus/${id_role}`, null);
    }

    delete(id_role: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Role/Delete/${id_role}`);
    }
}
