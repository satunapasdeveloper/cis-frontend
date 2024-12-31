import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { SetupKelompokTarifModel } from 'src/app/model/pages/billing/setup-data/setup-kelompok-tarif.model';

@Injectable({
    providedIn: 'root'
})
export class SetupKelompokTarifService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: SetupKelompokTarifModel.IKelompokTarifQueryParams): Observable<SetupKelompokTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-kelompok/getAll`, query);
    }

    getAllActive(query: SetupKelompokTarifModel.IKelompokTarifQueryParams): Observable<SetupKelompokTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-kelompok/getForLookUp`, query);
    }

    getById(id_tarif_kelompok: string): Observable<SetupKelompokTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-kelompok/getById/${id_tarif_kelompok}`);
    }

    create(payload: SetupKelompokTarifModel.Create): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_tarif_kelompok'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-tarif-kelompok/create`, payload);
    }

    update(payload: SetupKelompokTarifModel.Update): Observable<HttpBaseResponse> {
        const { id_tarif_kelompok, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-tarif-kelompok/update/${id_tarif_kelompok}`, data);
    }

    updateStatus(payload: SetupKelompokTarifModel.Update): Observable<HttpBaseResponse> {
        const { id_tarif_kelompok, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-tarif-kelompok/update/${id_tarif_kelompok}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
