import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { ItemModel } from 'src/app/model/pages/setup-data/item.model';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: ItemModel.IItemParams): Observable<ItemModel.GetAllItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item/getAll`, query);
    }

    getAllActive(query: ItemModel.IItemParams): Observable<ItemModel.GetAllItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item/getForLookup`, query);
    }

    getById(id_item: string): Observable<ItemModel.GetByIdItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item/getById/${id_item}`);
    }

    getAllKfa(nama_item: string): Observable<any> {
        const payload = {
            page: 1,
            count: 50,
            nama_item: nama_item
        };

        return this._httpRequestService.getRequest(`${environment.webApiUrl}/kfa/lookUpKfa`, payload);
    }

    getAllGolongan(): Observable<ItemModel.GetAllItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item/getGolongan`);
    }

    getAllJenis(): Observable<ItemModel.GetAllItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item/getJenis`);
    }

    create(payload: ItemModel.CreateItem): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_item'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-item/create`, payload);
    }

    update(payload: ItemModel.UpdateItem): Observable<HttpBaseResponse> {
        const { id_item, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item/update/${id_item}`, data);
    }

    updateStatus(payload: ItemModel.UpdateItem): Observable<HttpBaseResponse> {
        const { id_item, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item/update/${id_item}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
