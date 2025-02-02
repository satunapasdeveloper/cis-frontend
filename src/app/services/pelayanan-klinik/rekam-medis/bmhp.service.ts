import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class BmhpService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_register: string): Observable<any> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/f-penjualan-obat/getByIdRegister/${id_register}`);
    }

    getById(id_penjualan_obat: string): Observable<any> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/f-penjualan-obat/getById/${id_penjualan_obat}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/f-penjualan-obat/insertBmhp`, payload);
    }

    validasi(id_penjualan_obat: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/f-penjualan-obat/cancel/${id_penjualan_obat}`, null);
    }
}
