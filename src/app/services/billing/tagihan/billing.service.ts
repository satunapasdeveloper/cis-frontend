import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class BillingService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-billing/getForLookup`, query)
            .pipe(
                map((result) => {
                    result.data.rows = result.data.rows.map((item: any) => {
                        return {
                            ...item,
                            no_register: item.register.no_register,
                            nama_pasien: item.register.pasien.nama_pasien,
                            no_rekam_medis: item.register.pasien.no_rekam_medis,
                        }
                    });

                    return result;
                })
            )
    }

    getById(id_billing: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-billing/getById/${id_billing}`);
    }

    getDetailBilling(id_register: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-billing/getDetailItemAllModule/${id_register}`);
    }
}
