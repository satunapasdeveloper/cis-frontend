import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { RutePemberianObatModel } from 'src/app/model/pages/farmasi/setup-data/setup-rute-pemberian-obat.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupRutePemberianObatService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: RutePemberianObatModel.IRutePemberianObatQueryParams): Observable<RutePemberianObatModel.GetAllRutePemberianObat> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-rute-pemberian-obat/getAll`, query);
    }

    getAllActive(query: RutePemberianObatModel.IRutePemberianObatQueryParams): Observable<RutePemberianObatModel.GetAllRutePemberianObat> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-rute-pemberian-obat/getForLookUp`, query);
    }

    getById(id_rute_pemberian_obat: string): Observable<RutePemberianObatModel.GetByIdRutePemberianObat> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-rute-pemberian-obat/getById/${id_rute_pemberian_obat}`);
    }

    create(payload: RutePemberianObatModel.CreateRutePemberianObat): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_rute_pemberian_obat'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-rute-pemberian-obat/create`, payload);
    }

    update(payload: RutePemberianObatModel.UpdateRutePemberianObat): Observable<HttpBaseResponse> {
        const { id_rute_pemberian_obat, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-rute-pemberian-obat/update/${payload.id_rute_pemberian_obat}`, data);
    }

    updateStatus(payload: RutePemberianObatModel.UpdateRutePemberianObat): Observable<HttpBaseResponse> {
        const { id_rute_pemberian_obat, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-rute-pemberian-obat/update/${id_rute_pemberian_obat}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
