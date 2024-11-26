import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

    getAll(query: JabatanModel.IJabatanQueryParams): Observable<JabatanModel.GetAllJabatan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-jabatan/getAll`, query)
    }

    getAllActive(query: JabatanModel.IJabatanQueryParams): Observable<JabatanModel.GetAllJabatan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-kelas/getForLookUp`, query);
    }

    getById(id_jabatan: string): Observable<JabatanModel.GetByIdJabatan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-jabatan/getById/${id_jabatan}`);
    }

    create(payload: JabatanModel.CreateJabatan): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_jabatan'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-jabatan/create`, payload);
    }

    update(payload: JabatanModel.UpdateJabatan): Observable<HttpBaseResponse> {
        const { id_jabatan, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-jabatan/update/${payload.id_jabatan}`, data);
    }

    updateStatus(payload: JabatanModel.UpdateJabatan): Observable<HttpBaseResponse> {
        const { id_jabatan, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-jabatan/update/${id_jabatan}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_jabatan: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-jabatan/delete/${id_jabatan}`);
    }
}
