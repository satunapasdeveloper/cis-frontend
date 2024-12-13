import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { KondisiPulangModel } from 'src/app/model/pages/setup-data/kondisi-pulang.model';

@Injectable({
    providedIn: 'root'
})
export class KondisiPulangService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: KondisiPulangModel.IKondisiPulangQueryParams): Observable<KondisiPulangModel.GetAllKondisiPulang> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-kondisi-pulang/getAll`, query);
    }

    getAllActive(query: KondisiPulangModel.IKondisiPulangQueryParams): Observable<KondisiPulangModel.GetAllKondisiPulang> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-kondisi-pulang/getForLookUp`, query);
    }

    getById(id_kondisi_pulang: string): Observable<KondisiPulangModel.GetByIdKondisiPulang> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-kondisi-pulang/getById/${id_kondisi_pulang}`);
    }

    create(payload: KondisiPulangModel.CreateKondisiPulang): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_kondisi_pulang'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-kondisi-pulang/create`, payload);
    }

    update(payload: KondisiPulangModel.UpdateKondisiPulang): Observable<HttpBaseResponse> {
        const { id_kondisi_pulang, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-kondisi-pulang/update/${payload.id_kondisi_pulang}`, data);
    }

    updateStatus(payload: KondisiPulangModel.UpdateKondisiPulang): Observable<HttpBaseResponse> {
        const { id_kondisi_pulang, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-kondisi-pulang/update/${id_kondisi_pulang}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_kondisi_pulang: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-kondisi-pulang/delete/${id_kondisi_pulang}`);
    }
}
