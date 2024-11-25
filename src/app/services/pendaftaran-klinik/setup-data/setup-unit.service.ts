import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { UnitModel } from 'src/app/model/pages/setup-data/unit.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupUnitService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: UnitModel.IUnitQueryParams): Observable<UnitModel.GetAllUnit> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-unit/getAll`, query);
    }

    getAllActive(query: UnitModel.IUnitQueryParams): Observable<UnitModel.GetAllUnit> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-unit/getForLookUp`, query);
    }

    getById(id_unit: string): Observable<UnitModel.GetByIdUnit> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-unit/getById/${id_unit}`);
    }

    create(payload: UnitModel.CreateUnit): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_unit'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-unit/create`, payload);
    }

    update(payload: UnitModel.UpdateUnit): Observable<HttpBaseResponse> {
        const { id_unit, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-unit/update/${payload.id_unit}`, data);
    }

    updateStatus(payload: UnitModel.UpdateUnit): Observable<HttpBaseResponse> {
        const { id_unit, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-unit/update/${id_unit}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_unit: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-unit/delete/${id_unit}`);
    }
}
