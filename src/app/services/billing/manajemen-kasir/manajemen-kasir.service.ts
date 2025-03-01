import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class ManajemenKasirService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/kasir-shift/getForLookUp`, query);
    }

    getById(id_kasir_shift: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/kasir-shift/getById/${id_kasir_shift}`);
    }

    bukaKasir(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/kasir-shift/insertOpenKasir`, payload);
    }

    updateModalKasir(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/kasir-shift/updateModalKasir`, payload);
    }

    updateTutupKasir(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/kasir-shift/updateTutupKasir`, payload);
    }

    getComparePayment(id_kasir_shift: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/kasir-shift/getComparePembayaran/${id_kasir_shift}`);
    }

    croscekKasir(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/kasir-shift/approvedKasir`, payload);
    }
}
