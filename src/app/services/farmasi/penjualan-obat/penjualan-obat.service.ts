import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PenjualanObatService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllSetupTelaahPenjualanObat(): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-telaah/getTelaahPenjualanObat`)
    }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/f-penjualan-obat/findAll`, query)
    }

    getById(id_penjualan_obat: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/f-penjualan-obat/getById/${id_penjualan_obat}`)
    }

    create(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/f-penjualan-obat/insert`, payload)
    }

    deliver(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/f-penjualan-obat/updateDelivery`, payload)
    }

    changeStatusToDelivered(id_penjualan_obat: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/f-penjualan-obat/updateDeliveryDikirim/${id_penjualan_obat}`, null)
    }

    changeStatusBillingLunas(id_penjualan_obat: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/f-penjualan-obat/updateBillingLunas/${id_penjualan_obat}`, null)
    }

    cancel(id_penjualan_obat: number, reason_canceled: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/f-penjualan-obat/cancel/${id_penjualan_obat}/${reason_canceled}`, null)
    }

    deleteDetail(id_penjualan_obat_obat: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/f-penjualan-obat/deleteDetail/${id_penjualan_obat_obat}`)
    }
}
