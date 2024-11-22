import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { PenjaminModel } from 'src/app/model/pages/setup-data/penjamin.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PenjaminService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<PenjaminModel.GetAllPenjamin> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Penjamin/GetAll`);
    }

    getById(id_penjamin: string): Observable<PenjaminModel.GetByIdPenjamin> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Penjamin/GetByUuid/${id_penjamin}`);
    }

    create(payload: PenjaminModel.CreatePenjamin): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_penjamin'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Penjamin/Create`, payload);
    }

    update(payload: PenjaminModel.UpdatePenjamin): Observable<HttpBaseResponse> {
        const { id_penjamin, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Penjamin/Update/${payload.id_penjamin}`, data);
    }

    updateStatus(id_penjamin: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Penjamin/UpdateStatus/${id_penjamin}`, null);
    }

    delete(id_penjamin: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Penjamin/Delete/${id_penjamin}`);
    }
}
