import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { AsalRujukanModel } from 'src/app/model/pages/setup-data/asal-rujukan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class AsalRujukanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: AsalRujukanModel.IAsalRujukanQueryParams): Observable<AsalRujukanModel.GetAllAsalRujukan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-asal-rujukan/getAll`, query);
    }

    getAllActive(query: AsalRujukanModel.IAsalRujukanQueryParams): Observable<AsalRujukanModel.GetAllAsalRujukan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-asal-rujukan/getForLookUp`, query);
    }

    getById(id_asal_rujukan: string): Observable<AsalRujukanModel.GetByIdAsalRujukan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-asal-rujukan/getById/${id_asal_rujukan}`);
    }

    create(payload: AsalRujukanModel.CreateAsalRujukan): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_asal_rujukan'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-asal-rujukan/create`, payload);
    }

    update(payload: AsalRujukanModel.UpdateAsalRujukan): Observable<HttpBaseResponse> {
        const { id_asal_rujukan, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-asal-rujukan/update/${payload.id_asal_rujukan}`, data);
    }

    updateStatus(payload: AsalRujukanModel.UpdateAsalRujukan): Observable<HttpBaseResponse> {
        const { id_asal_rujukan, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-asal-rujukan/update/${id_asal_rujukan}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_asal_rujukan: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-asal-rujukan/delete/${id_asal_rujukan}`);
    }
}
