import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { NakesModel } from 'src/app/model/pages/setup-data/nakes.model';

@Injectable({
    providedIn: 'root'
})
export class NakesService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<NakesModel.GetAllNakes> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Nakes/GetAll`);
    }

    getById(id_nakes: string): Observable<NakesModel.GetByIdNakes> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Nakes/GetByUuid/${id_nakes}`);
    }

    create(payload: NakesModel.CreateNakes): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_nakes'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Nakes/Create`, payload);
    }

    update(payload: NakesModel.UpdateNakes): Observable<HttpBaseResponse> {
        const { id_nakes, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Nakes/Update/${payload.id_nakes}`, data);
    }

    updateStatus(id_nakes: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Nakes/UpdateStatus/${id_nakes}`, null);
    }

    delete(id_nakes: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Nakes/Delete/${id_nakes}`);
    }
}
