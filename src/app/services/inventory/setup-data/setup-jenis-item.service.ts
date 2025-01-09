import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { JenisItemModel } from 'src/app/model/pages/inventory/setup-data/setup-jenis-item.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupJenisItemService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: JenisItemModel.IJenisItemQueryParams): Observable<JenisItemModel.GetAllJenisItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-jenis/getAll`, query);
    }

    getAllActive(query: JenisItemModel.IJenisItemQueryParams): Observable<JenisItemModel.GetAllJenisItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-jenis/getForLookUp`, query);
    }

    getById(id_item_jenis: string): Observable<JenisItemModel.GetByIdJenisItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-jenis/getById/${id_item_jenis}`);
    }

    create(payload: JenisItemModel.CreateJenisItem): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_item_jenis'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-item-jenis/create`, payload);
    }

    update(payload: JenisItemModel.UpdateJenisItem): Observable<HttpBaseResponse> {
        const { id_item_jenis, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item-jenis/update/${payload.id_item_jenis}`, data);
    }

    updateStatus(payload: JenisItemModel.UpdateJenisItem): Observable<HttpBaseResponse> {
        const { id_item_jenis, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item-jenis/update/${id_item_jenis}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
