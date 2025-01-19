import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../http/http-request.service';
import { Observable, map } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LaboratoriumService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_register: string): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-order-penunjang/getOrderLabByIdRegister/${id_register}`)
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

    getById(id_order_penunjang: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-order-penunjang/getById/${id_order_penunjang}`);
    }

    create(payload: AnalyserNode): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-order-penunjang/insertLab`, payload);
    }

    cancel(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-order-penunjang/cancel/${payload.id_order_penunjang}/${payload.reason_canceled}`, null);
    }
}
