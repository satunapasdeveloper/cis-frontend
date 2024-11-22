import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { KategoriKamarModel } from 'src/app/model/pages/setup-data/kategori-kamar.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupKategoriKamarService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<KategoriKamarModel.GetAllKategoriKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/KategoriKamar/GetAll`);
    }

    getById(id_kategori: string): Observable<KategoriKamarModel.GetByIdKategoriKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/KategoriKamar/GetByUuid/${id_kategori}`);
    }

    create(payload: KategoriKamarModel.CreateKategoriKamar): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_kategori'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/KategoriKamar/Create`, payload);
    }

    update(payload: KategoriKamarModel.UpdateKategoriKamar): Observable<HttpBaseResponse> {
        const { id_kategori, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/KategoriKamar/Update/${payload.id_kategori}`, data);
    }

    updateStatus(id_kategori: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/KategoriKamar/UpdateStatus/${id_kategori}`, null);
    }

    delete(id_kategori: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/KategoriKamar/Delete/${id_kategori}`);
    }
}
