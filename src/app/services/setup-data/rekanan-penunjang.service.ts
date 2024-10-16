import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { RekananPenunjangModel } from 'src/app/model/pages/setup-data/rekanan-penunjang.model';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RekananPenunjangService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<RekananPenunjangModel.GetAllRekananPenunjang> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunafas/rekanan-penunjang/RekananPenunjang`);
    }

    create(payload: RekananPenunjangModel.CreateRekananPenunjang): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunafas/rekanan-penunjang/TambahRekananPenunjang`, payload);
    }

    update(payload: RekananPenunjangModel.UpdateRekananPenunjang): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunafas/rekanan-penunjang/UpdateRekananPenunjang`, payload);
    }

    delete(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunafas/rekanan-penunjang/DeleteRekananPenunjang/${uuid}`);
    }
}
