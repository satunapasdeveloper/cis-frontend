import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupGrupTarifModel } from 'src/app/model/pages/billing/setup-data/setup-grup-tarif.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupGrupTarifService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getJenisTarif(): Observable<any> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-grup/getAll`);
    }

    getAll(jenis_tarif: string): Observable<SetupGrupTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-grup/getAll/${jenis_tarif}`);
    }

    getById(id_tarif_grup: string): Observable<SetupGrupTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-grup/getById/${id_tarif_grup}`);
    }

    createChild(payload: SetupGrupTarifModel.CreateChild): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_tarif_grup'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-tarif-grup/createChild`, payload);
    }

    createParent(payload: SetupGrupTarifModel.CreateParent): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_tarif_grup'];
        delete (<any>payload)['id_tarif_grup_parent'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-tarif-grup/createParent`, payload);
    }

    update(payload: SetupGrupTarifModel.Update): Observable<HttpBaseResponse> {
        const { id_tarif_grup, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-tarif-grup/update/${payload.id_tarif_grup}`, data);
    }
}
