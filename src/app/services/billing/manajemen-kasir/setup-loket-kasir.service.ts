import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupLoketKasirService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-loket-kasir/getAll`, query);
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-loket-kasir/getForLookUp`, query);
    }

    getById(id_loket_kasir: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-loket-kasir/getById/${id_loket_kasir}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_loket_kasir'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-loket-kasir/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_loket_kasir, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-loket-kasir/update/${id_loket_kasir}`, data);
    }

    updateStatus(payload: any): Observable<HttpBaseResponse> {
        const { id_loket_kasir, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-loket-kasir/update/${id_loket_kasir}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
