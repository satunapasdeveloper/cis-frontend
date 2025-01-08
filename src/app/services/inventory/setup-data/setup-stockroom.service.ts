import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { StockroomModel } from 'src/app/model/pages/inventory/setup-data/setup-stockroom.model';

@Injectable({
    providedIn: 'root'
})
export class SetupStockroomService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: StockroomModel.IQueryString): Observable<StockroomModel.GetAllStockroom> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-stokroom/getAll`, params);
    }

    getAllActive(params: StockroomModel.IQueryString): Observable<StockroomModel.GetAllStockroom> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-stokroom/getForLookup`, params);
    }

    getById(id_stokroom: string): Observable<StockroomModel.GetByIdStockroom> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-stokroom/getById/${id_stokroom}`);
    }

    create(payload: StockroomModel.CreateStockroom): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_stokroom'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-stokroom/create`, payload);
    }

    update(payload: StockroomModel.UpdateStockroom): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-stokroom/update`, payload);
    }

    updateStatus(payload: StockroomModel.UpdateStockroom): Observable<HttpBaseResponse> {
        const { id_stokroom, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-stokroom/update/${id_stokroom}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
