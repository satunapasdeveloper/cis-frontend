import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PenerimaanBarangModel } from 'src/app/model/pages/farmasi/purchasing/penerimaan-barang.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PenerimaanBarangService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: PenerimaanBarangModel.IQueryString): Observable<PenerimaanBarangModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/penerimaan-barang`, params);
    }

    getById(id_penerimaan_barang: string): Observable<PenerimaanBarangModel.GetById> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/penerimaan-barang/${id_penerimaan_barang}`);
    }

    create(payload: PenerimaanBarangModel.Create): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/penerimaan-barang/insert`, payload);
    }

    cancel(payload: PenerimaanBarangModel.Cancel): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/penerimaan-barang/cancel`, payload);
    }

    validasi(id_penerimaan_barang: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/penerimaan-barang/validasi/${id_penerimaan_barang}`, null);
    }
}
