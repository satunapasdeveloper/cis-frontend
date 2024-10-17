import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { GolonganModel } from 'src/app/model/pages/farmasi/setup-data/setup-golongan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupGolonganService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: GolonganModel.IQueryString): Observable<GolonganModel.GetAllGolongan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/golongan`, params);
    }

    create(payload: GolonganModel.CreateGolongan): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/golongan/insert`, payload);
    }

    update(payload: GolonganModel.UpdateGolongan): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/golongan/update`, payload);
    }

    delete(id_golongan: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/golongan/${id_golongan}`);
    }
}
