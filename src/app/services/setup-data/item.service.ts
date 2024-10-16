import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { ItemModel } from 'src/app/model/pages/setup-data/item.model';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<ItemModel.GetAllItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Item/GetAll`);
    }

    getById(uuid: string): Observable<ItemModel.GetByIdItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Item/GetByUuid/${uuid}`);
    }

    getAllIcd9(keyword?: string): Observable<ItemModel.GetAllKfa> {
        const payload = {
            cari: keyword ? keyword : ""
        };

        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Item/GetKfa`, payload);
    }

    create(payload: ItemModel.CreateItem): Observable<HttpBaseResponse> {
        delete (<any>payload)['uuid'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Item/Create`, payload);
    }

    update(payload: ItemModel.UpdateItem): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Item/Update/${payload.uuid}`, payload);
    }

    updateStatus(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/Item/UpdateStatus/${uuid}`, null);
    }

    delete(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/Item/Delete/${uuid}`);
    }
}
