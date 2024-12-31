import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupTarifModel } from 'src/app/model/pages/billing/setup-data/setup-tarif.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupTarifService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllForTindakanMedis(query: SetupTarifModel.GetForTindakanMedisQueryParams): Observable<SetupTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif/lookUpForTindakanMedis`, query);
    }

    getAllActive(query: SetupTarifModel.GetAllQueryParams): Observable<SetupTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif/getForLookUp`, query);
    }

    create(payload: SetupTarifModel.Create): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_tarif'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-tarif/create`, payload);
    }

    update(payload: SetupTarifModel.Update): Observable<HttpBaseResponse> {
        const { id_tarif, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-tarif/update/${id_tarif}`, data);
    }

}
