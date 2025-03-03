import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupKamarOperasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-ruang-operasi/getAll`, query);
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-ruang-operasi/getForLookUp`, query);
    }

    getById(id_ruang_operasi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-ruang-operasi/getById/${id_ruang_operasi}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_ruang_operasi'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-ruang-operasi/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_ruang_operasi, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-ruang-operasi/update/${payload.id_ruang_operasi}`, data);
    }

    updateStatus(payload: any): Observable<HttpBaseResponse> {
        const { id_ruang_operasi, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-ruang-operasi/update/${id_ruang_operasi}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
