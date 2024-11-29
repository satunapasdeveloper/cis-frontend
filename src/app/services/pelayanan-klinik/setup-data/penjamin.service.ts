import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PenjaminModel } from 'src/app/model/pages/setup-data/penjamin.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PenjaminService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: PenjaminModel.IPenjaminQueryParams): Observable<PenjaminModel.GetAllPenjamin> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-penjamin/getAll`, query);
    }

    getAllActive(query: PenjaminModel.IPenjaminQueryParams): Observable<PenjaminModel.GetAllPenjamin> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-penjamin/getForLookUp`, query);
    }

    getById(id_penjamin: string): Observable<PenjaminModel.GetByIdPenjamin> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-penjamin/getById/${id_penjamin}`);
    }

    create(payload: PenjaminModel.CreatePenjamin): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_penjamin'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-penjamin/create`, payload);
    }

    update(payload: PenjaminModel.UpdatePenjamin): Observable<HttpBaseResponse> {
        const { id_penjamin, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-penjamin/update/${id_penjamin}`, data);
    }

    updateStatus(payload: PenjaminModel.UpdatePenjamin): Observable<HttpBaseResponse> {
        const { id_penjamin, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-penjamin/update/${id_penjamin}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_penjamin: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-penjamin/delete/${id_penjamin}`);
    }
}
