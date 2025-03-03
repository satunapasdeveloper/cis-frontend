import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupDokterOperasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-dokter-operasi/getAll`, query);
    }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-dokter-operasi/getForLookUp`, query);
    }

    getById(id_dokter_operasi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-dokter-operasi/getById/${id_dokter_operasi}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_dokter_operasi'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-dokter-operasi/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_dokter_operasi, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-dokter-operasi/update/${payload.id_dokter_operasi}`, data);
    }

    updateStatus(payload: any): Observable<HttpBaseResponse> {
        const { id_dokter_operasi, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-dokter-operasi/update/${id_dokter_operasi}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
