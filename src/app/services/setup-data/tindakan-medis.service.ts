import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { TindakanMedisModel } from 'src/app/model/pages/setup-data/tindakan-medis.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class TindakanMedisService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<TindakanMedisModel.GetAllTindakanMedis> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Tindakan/GetAll`);
    }

    getById(uuid: string): Observable<TindakanMedisModel.GetByIdTindakanMedis> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Tindakan/GetByUuid/${uuid}`);
    }

    getAllIcd9(keyword?: string): Observable<TindakanMedisModel.GetAllIcd9> {
        const payload = {
            cari: keyword ? keyword : ""
        };

        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Tindakan/GetAllIcd9`, payload);
    }

    create(payload: TindakanMedisModel.CreateTindakanMedis): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Tindakan/Create`, payload);
    }

    update(payload: TindakanMedisModel.UpdateTindakanMedis): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Tindakan/Update/${payload.uuid}`, payload);
    }

    updateStatus(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Tindakan/UpdateStatus/${uuid}`, null);
    }

    delete(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Tindakan/Delete/${uuid}`);
    }
}
