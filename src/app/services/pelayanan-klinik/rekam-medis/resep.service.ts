import { Injectable } from '@angular/core';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { of, map, Observable } from 'rxjs';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class ResepService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getResep(id_register: string): Observable<any> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-resep/getByIdRegister/${id_register}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-resep/insert`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_resep, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-resep/update/${id_resep}`, data);
    }

    cancel(id_resep: any, reason_canceled: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-resep/cancel/${id_resep}/${reason_canceled}`, null);
    }
}
