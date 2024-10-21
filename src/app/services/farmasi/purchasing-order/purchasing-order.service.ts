import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { PurchasingOrderModel } from 'src/app/model/pages/farmasi/purchasing/pemesanan-po.model';

@Injectable({
    providedIn: 'root'
})
export class PurchasingOrderService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: PurchasingOrderModel.IQueryString): Observable<PurchasingOrderModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/pembelian`, params);
    }

    getById(id_pembelian: string): Observable<PurchasingOrderModel.GetById> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/pembelian/${id_pembelian}`);
    }

    create(payload: PurchasingOrderModel.Create): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/pembelian/insert`, payload);
    }

    cancel(payload: PurchasingOrderModel.Cancel): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/pembelian/cancel`, payload);
    }

    validasi(id_pembelian: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/pembelian/validasi/${id_pembelian}`, null);
    }
}
