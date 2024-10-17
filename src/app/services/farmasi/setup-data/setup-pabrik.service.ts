import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PabrikModel } from 'src/app/model/pages/farmasi/setup-data/setup-pabrik.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupPabrikService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: PabrikModel.IQueryString): Observable<PabrikModel.GetAllPabrik> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/manufacture`, params);
    }

    create(payload: PabrikModel.CreatePabrik): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/manufacture/insert`, payload);
    }

    update(payload: PabrikModel.UpdatePabrik): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/manufacture/update`, payload);
    }

    delete(id_manufacture: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/manufacture/${id_manufacture}`);
    }
}
