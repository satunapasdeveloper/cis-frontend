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

    getAll(): Observable<UnitModel.GetAllUnit> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Unit/GetAll`);
    }

    getById(id_unit: string): Observable<UnitModel.GetByIdUnit> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Unit/GetByUuid/${id_unit}`);
    }

    create(payload: UnitModel.CreateUnit): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_unit'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Unit/Create`, payload);
    }

    update(payload: UnitModel.UpdateUnit): Observable<HttpBaseResponse> {
        const { id_unit, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Unit/Update/${payload.id_unit}`, data);
    }

    updateStatus(id_unit: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Unit/UpdateStatus/${id_unit}`, null);
    }

    delete(id_unit: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Unit/Delete/${id_unit}`);
    }
}
