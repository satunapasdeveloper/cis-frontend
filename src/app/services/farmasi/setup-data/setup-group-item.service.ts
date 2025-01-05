import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { GroupItemModel } from 'src/app/model/pages/farmasi/setup-data/setup-grup-item.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupGroupItemService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: GroupItemModel.IGroupItemQueryParams): Observable<GroupItemModel.GetAllGroupItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-grup/getAll`, query);
    }

    getAllActive(query: GroupItemModel.IGroupItemQueryParams): Observable<GroupItemModel.GetAllGroupItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-grup/getForLookUp`, query);
    }

    getById(id_item_grup: string): Observable<GroupItemModel.GetByIdGroupItem> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-item-grup/getById/${id_item_grup}`);
    }

    create(payload: GroupItemModel.CreateGroupItem): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_item_grup'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-item-grup/create`, payload);
    }

    update(payload: GroupItemModel.UpdateGroupItem): Observable<HttpBaseResponse> {
        const { id_item_grup, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item-grup/update/${payload.id_item_grup}`, data);
    }

    updateStatus(payload: GroupItemModel.UpdateGroupItem): Observable<HttpBaseResponse> {
        const { id_item_grup, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-item-grup/update/${id_item_grup}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
