import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupMetodePembayaranService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-metode-pembayaran/getAll`, query);
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-metode-pembayaran/getForLookUp`, query);
    }

    getById(id_metode_pembayaran: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-metode-pembayaran/getById/${id_metode_pembayaran}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_metode_pembayaran'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-metode-pembayaran/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_metode_pembayaran, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-metode-pembayaran/update/${id_metode_pembayaran}`, data);
    }

    updateStatus(payload: any): Observable<HttpBaseResponse> {
        const { id_metode_pembayaran, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-metode-pembayaran/update/${id_metode_pembayaran}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
