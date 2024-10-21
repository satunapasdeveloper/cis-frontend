import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { ReturKonsinyasiModel } from 'src/app/model/pages/farmasi/purchasing/retur-konsinyasi.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class ReturKonsinyasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: ReturKonsinyasiModel.IQueryString): Observable<ReturKonsinyasiModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/retur-konsinyasi`, params);
    }

    getById(id_retur_konsinyasi: string): Observable<ReturKonsinyasiModel.GetById> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/retur-konsinyasi/${id_retur_konsinyasi}`);
    }

    create(payload: ReturKonsinyasiModel.Create): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/retur-konsinyasi/insert`, payload);
    }

    cancel(payload: ReturKonsinyasiModel.Cancel): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/retur-konsinyasi/cancel`, payload);
    }

    validasi(id_retur_konsinyasi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/retur-konsinyasi/validasi/${id_retur_konsinyasi}`, null);
    }
}
