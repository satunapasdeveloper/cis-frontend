import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SatuanModel } from 'src/app/model/pages/farmasi/setup-data/setup-satuan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupSatuanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: SatuanModel.ISatuanQueryParams): Observable<SatuanModel.GetAllSatuan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-satuan/getAll`, query);
    }

    getAllActive(query: SatuanModel.ISatuanQueryParams): Observable<SatuanModel.GetAllSatuan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-jenis/getForLookUp`, query);
    }

    getById(id_satuan: string): Observable<SatuanModel.GetByIdSatuan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-jenis/getById/${id_satuan}`);
    }

    create(payload: SatuanModel.CreateSatuan): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_satuan'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-item-jenis/create`, payload);
    }

    update(payload: SatuanModel.UpdateSatuan): Observable<HttpBaseResponse> {
        const { id_satuan, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item-jenis/update/${payload.id_satuan}`, data);
    }

    updateStatus(payload: SatuanModel.UpdateSatuan): Observable<HttpBaseResponse> {
        const { id_satuan, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item-jenis/update/${id_satuan}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
