import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PenerimaanKonsinyasiModel } from 'src/app/model/pages/farmasi/purchasing/penerimaan-konsinyasi.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PenerimaanKonsinyasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: PenerimaanKonsinyasiModel.IQueryString): Observable<PenerimaanKonsinyasiModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/penerimaan-konsinyasi`, params);
    }

    getById(id_penerimaan_konsinyasi: string): Observable<PenerimaanKonsinyasiModel.GetById> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/penerimaan-konsinyasi/${id_penerimaan_konsinyasi}`);
    }

    create(payload: PenerimaanKonsinyasiModel.Create): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/penerimaan-konsinyasi/insert`, payload);
    }

    cancel(payload: PenerimaanKonsinyasiModel.Cancel): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/penerimaan-konsinyasi/cancel`, payload);
    }

    validasi(id_penerimaan_konsinyasi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/penerimaan-konsinyasi/validasi/${id_penerimaan_konsinyasi}`, null);
    }
}
