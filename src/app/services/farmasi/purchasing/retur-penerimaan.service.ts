import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { ReturPembelianModel } from 'src/app/model/pages/farmasi/purchasing/retur-penerimaan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class ReturPenerimaanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: ReturPembelianModel.IQueryString): Observable<ReturPembelianModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/retur-pembelian`, params);
    }

    getById(id_retur_pembelian: string): Observable<ReturPembelianModel.GetById> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/retur-pembelian/${id_retur_pembelian}`);
    }

    create(payload: ReturPembelianModel.Create): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/retur-pembelian/insert`, payload);
    }

    cancel(payload: ReturPembelianModel.Cancel): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/retur-pembelian/cancel`, payload);
    }

    validasi(id_retur_pembelian: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/retur-pembelian/validasi/${id_retur_pembelian}`, null);
    }
}
