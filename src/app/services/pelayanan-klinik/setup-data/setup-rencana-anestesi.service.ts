import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupRencanaAnestesiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-rencana-anestesi/getAll`, query);
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-rencana-anestesi/getForLookUp`, query);
    }

    getById(id_rencana_anestesi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-rencana-anestesi/getById/${id_rencana_anestesi}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_rencana_anestesi'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-rencana-anestesi/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_rencana_anestesi, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-rencana-anestesi/update/${payload.id_rencana_anestesi}`, data);
    }

    updateStatus(payload: any): Observable<HttpBaseResponse> {
        const { id_rencana_anestesi, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-rencana-anestesi/update/${id_rencana_anestesi}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
