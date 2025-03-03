import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PermintaanOperasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-permintaan-operasi/lookUp`, query)
    }

    getById(id_permintaan_operasi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-permintaan-operasi/getById/${id_permintaan_operasi}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_permintaan_operasi'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-permintaan-operasi/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_permintaan_operasi, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/update/${id_permintaan_operasi}`, data);
    }

    approve(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/approve`, payload);
    }

    execution(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/execution`, payload);
    }

    cancel(id_permintaan_operasi: any, reason_canceled: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/cancel/${id_permintaan_operasi}/${reason_canceled}`, null);
    }
}
