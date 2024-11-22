import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { KamarModel } from 'src/app/model/pages/setup-data/kamar.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class KamarService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<KamarModel.GetAllKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Kamar/GetAll`);
    }

    getById(id_kamar: string): Observable<KamarModel.GetByIdKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Kamar/GetByUuid/${id_kamar}`);
    }

    create(payload: KamarModel.CreateKamar): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_kamar'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Kamar/Create`, payload);
    }

    update(payload: KamarModel.UpdateKamar): Observable<HttpBaseResponse> {
        const { id_kamar, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Kamar/Update/${payload.id_kamar}`, data);
    }

    updateStatus(id_kamar: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Kamar/UpdateStatus/${id_kamar}`, null);
    }

    delete(id_kamar: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Kamar/Delete/${id_kamar}`);
    }
}
