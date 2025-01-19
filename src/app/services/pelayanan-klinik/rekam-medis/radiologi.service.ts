import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class RadiologiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_register: string): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-order-penunjang/getOrderRadByIdRegister/${id_register}`)
            .pipe(
                map((result) => {
                    if (result.responseResult) {
                        result.data = result.data.map((item: any) => {
                            return {
                                ...item,
                                nama_tarif: item.tarif.nama_tarif,
                                tanggal_order_penunjang: item.order_penunjang.tanggal_order_penunjang,
                                nomor_order_penunjang: item.order_penunjang.nomor_order_penunjang,
                            }
                        })
                    }

                    return result;
                })
            )
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-order-penunjang/getAll`, query)
            .pipe(
                map((result) => {
                    if (result.responseResult) {
                        result.data.rows = result.data.rows.map((item: any) => {
                            return {
                                ...item,
                                no_register: item.register.no_register,
                                no_rekam_medis: item.register.pasien.no_rekam_medis,
                                nama_pasien: item.register.pasien.nama_pasien,
                                gender: item.register.pasien.gender,
                                tanggal_lahir: item.register.pasien.tanggal_lahir,
                                nama_penjamin: item.register.penjamin.nama_penjamin,
                            }
                        })
                    }

                    return result;
                })
            )
    }


    getById(id_order_penunjang: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-order-penunjang/getById/${id_order_penunjang}`);
    }

    create(payload: AnalyserNode): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-order-penunjang/insertRad`, payload);
    }

    cancel(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-order-penunjang/cancel/${payload.id_order_penunjang}/${payload.reason_canceled}`, null);
    }

    updateJadwal(id_order_penunjang: any, tanggal_tes: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-order-penunjang/updateJadwal/${id_order_penunjang}/${tanggal_tes}`, null);
    }

    verifikasi(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-order-penunjang/verification`, payload);
    }

    createHasilHeader(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-order-penunjang/insertHasilHeader`, payload);
    }

    deleteHasilHeader(id_order_penunjang: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/tr-order-penunjang/deleteHasilHeader/${id_order_penunjang}`);
    }

    createHasilDetail(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-order-penunjang/insertHasilDetail`, payload);
    }

    deleteHasilDetail(id_order_penunjang: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/tr-order-penunjang/deleteHasilDetail/${id_order_penunjang}`);
    }
}
