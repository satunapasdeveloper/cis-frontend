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

    getAll(query: KategoriKamarModel.IKategoriKamarQueryParams): Observable<KategoriKamarModel.GetAllKategoriKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-bed-kategori/getAll`, query);
    }

    getAllActive(query: KategoriKamarModel.IKategoriKamarQueryParams): Observable<KategoriKamarModel.GetAllKategoriKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-role/getForLookUp`, query);
    }

    getById(id_bed_kategori: string): Observable<KategoriKamarModel.GetByIdKategoriKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-bed-kategori/getById/${id_bed_kategori}`);
    }

    create(payload: KategoriKamarModel.CreateKategoriKamar): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_bed_kategori'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-bed-kategori/create`, payload);
    }

    update(payload: KategoriKamarModel.UpdateKategoriKamar): Observable<HttpBaseResponse> {
        const { id_bed_kategori, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-bed-kategori/update/${payload.id_bed_kategori}`, data);
    }

    updateStatus(payload: KategoriKamarModel.UpdateKategoriKamar): Observable<HttpBaseResponse> {
        const { id_bed_kategori, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-bed-kategori/update/${id_bed_kategori}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_bed_kategori: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-bed-kategori/delete/${id_bed_kategori}`);
    }
}
