import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { KelasModel } from 'src/app/model/pages/setup-data/kelas.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupKelasService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<KelasModel.GetAllKelas> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Kelas/GetAll`);
    }

    getById(id_kelas: string): Observable<KelasModel.GetByIdKelas> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Kelas/GetByUuid/${id_kelas}`);
    }

    create(payload: KelasModel.CreateKelas): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_kelas'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Kelas/Create`, payload);
    }

    update(payload: KelasModel.UpdateKelas): Observable<HttpBaseResponse> {
        const { id_kelas, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Kelas/Update/${payload.id_kelas}`, data);
    }

    updateStatus(id_kelas: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Kelas/UpdateStatus/${id_kelas}`, null);
    }

    delete(id_kelas: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Kelas/Delete/${id_kelas}`);
    }
}
