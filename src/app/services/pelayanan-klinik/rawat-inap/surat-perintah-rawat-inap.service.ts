import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SuratPerintahRawatInapService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-spri/getAll`, query);
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-spri/getForLookUp`, query);
    }

    getById(id_spri: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-spri/getById/${id_spri}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_spri'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-spri/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_spri, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-spri/update/${payload.id_spri}`, data);
    }

    updateStatus(payload: any): Observable<HttpBaseResponse> {
        const { id_spri, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-spri/update/${payload.id_spri}`, {
            ...data,
            is_active: !data.is_active
        });
    }
}
