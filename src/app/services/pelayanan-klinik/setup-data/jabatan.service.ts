import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { JabatanModel } from 'src/app/model/pages/setup-data/jabatan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class JabatanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<JabatanModel.GetAllJabatan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Jabatan/GetAll`);
    }

    getById(id_jabatan: string): Observable<JabatanModel.GetByIdJabatan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Jabatan/GetByUuid/${id_jabatan}`);
    }

    create(payload: JabatanModel.CreateJabatan): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_jabatan'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Jabatan/Create`, payload);
    }

    update(payload: JabatanModel.UpdateJabatan): Observable<HttpBaseResponse> {
        const { id_jabatan, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Jabatan/Update/${payload.id_jabatan}`, data);
    }

    updateStatus(id_jabatan: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Jabatan/UpdateStatus/${id_jabatan}`, null);
    }

    delete(id_jabatan: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Jabatan/Delete/${id_jabatan}`);
    }
}
