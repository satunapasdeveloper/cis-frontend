import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { BedModel } from 'src/app/model/pages/setup-data/bed.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class BedService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<BedModel.GetAllBed> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Bed/GetAll`);
    }

    getById(id_bed: string): Observable<BedModel.GetByIdBed> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Bed/GetByUuid/${id_bed}`);
    }

    create(payload: BedModel.CreateBed): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_bed'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Bed/Create`, payload);
    }

    update(payload: BedModel.UpdateBed): Observable<HttpBaseResponse> {
        const { id_bed, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Bed/Update/${payload.id_bed}`, data);
    }

    updateStatus(id_bed: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Bed/UpdateStatus/${id_bed}`, null);
    }

    delete(id_bed: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Bed/Delete/${id_bed}`);
    }
}
