import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { Observable } from 'rxjs';
import { PoliModel } from 'src/app/model/pages/setup-data/poli.model';
import { environment } from 'src/environments/environment';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class PoliService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<PoliModel.GetAllPoli> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/poli/Poli`);
    }

    create(payload: PoliModel.CreatePoli): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/poli/TambahPoli`, payload);
    }

    update(payload: PoliModel.UpdatePoli): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/poli/UpdatePoli`, payload);
    }

    delete(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/poli/DeletePoli/${uuid}`);
    }
}
