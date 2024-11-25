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

    getAll(query: KelasModel.IKelasQueryParams): Observable<KelasModel.GetAllKelas> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-kelas/getAll`, query);
    }

    getAllActive(query: KelasModel.IKelasQueryParams): Observable<KelasModel.GetAllKelas> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-kelas/getForLookUp`, query);
    }

    getById(id_kelas: string): Observable<KelasModel.GetByIdKelas> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-kelas/getById/${id_kelas}`);
    }

    create(payload: KelasModel.CreateKelas): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_kelas'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-kelas/create`, payload);
    }

    update(payload: KelasModel.UpdateKelas): Observable<HttpBaseResponse> {
        const { id_kelas, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-kelas/update/${payload.id_kelas}`, data);
    }

    updateStatus(payload: KelasModel.UpdateKelas): Observable<HttpBaseResponse> {
        const { id_kelas, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-kelas/update/${id_kelas}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_kelas: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-kelas/delete/${id_kelas}`);
    }
}
