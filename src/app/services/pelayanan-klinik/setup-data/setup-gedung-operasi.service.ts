import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupGedungOperasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-gedung-operasi/getAll`, query);
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-gedung-operasi/getForLookUp`, query);
    }

    getById(id_gedung_operasi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-gedung-operasi/getById/${id_gedung_operasi}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_gedung_operasi'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-gedung-operasi/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_gedung_operasi, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-gedung-operasi/update/${payload.id_gedung_operasi}`, data);
    }

    updateStatus(payload: any): Observable<HttpBaseResponse> {
        const { id_gedung_operasi, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-gedung-operasi/update/${id_gedung_operasi}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
