import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { PasienModel } from 'src/app/model/pages/pasien/pasien.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpBaseResponse, PostRequestByDynamicFiterModel } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class PasienService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(parameter?: PostRequestByDynamicFiterModel[]): Observable<PasienModel.GetAllPasien> {
        const filter = { filter: parameter ? parameter : [] };

        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/pasien/GetAllPasienByParams`, filter);
    }

    getById(id_pasien: string): Observable<PasienModel.GetByIdPasien> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/pasien/GetPasienById/${id_pasien}`, null);
    }

    create(payload: PasienModel.CreatePasien): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/pasien/PendaftaranPasienBaru`, payload);
    }

    update(payload: PasienModel.UpdatePasien): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/pasien/UpdateDataPasien`, payload);
    }

    updateStatus(id_pasien: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/pasien/UpdateActivePasien`, { id_pasien: id_pasien });
    }
}
