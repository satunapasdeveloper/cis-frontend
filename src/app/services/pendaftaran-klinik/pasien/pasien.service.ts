import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../http/http-request.service';
import { PasienModel } from 'src/app/model/pages/pasien/pasien.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class PasienService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: PasienModel.IPasienQueryParams): Observable<PasienModel.GetAllPasien> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-pasien/getAll`, query);
    }

    getAllActive(query: PasienModel.IPasienQueryParams): Observable<PasienModel.GetAllPasien> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-pasien/getForLookUp`, query);
    }

    getById(id_pasien: string): Observable<PasienModel.GetByIdPasien> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-pasien/getById/${id_pasien}`);
    }

    create(payload: PasienModel.CreatePasien): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-pasien/create`, payload);
    }

    update(payload: PasienModel.UpdatePasien): Observable<HttpBaseResponse> {
        const { id_pasien, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-pasien/update/${id_pasien}`, data);
    }

    updateStatus(payload: PasienModel.UpdatePasien): Observable<HttpBaseResponse> {
        const { id_pasien, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-pasien/update/${id_pasien}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    createPenjamin(payload: PasienModel.CreatePenjamin): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-pasien/createDetailPenjamin`, payload);
    }

    updatePenjamin(payload: PasienModel.UpdatePenjamin): Observable<HttpBaseResponse> {
        const { id_pasien_penjamin, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-pasien/updatePasienPenjamin/${id_pasien_penjamin}`, data);
    }
}
