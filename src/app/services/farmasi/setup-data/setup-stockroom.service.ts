import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { StockroomModel } from 'src/app/model/pages/farmasi/setup-data/setup-stockroom.model';

@Injectable({
    providedIn: 'root'
})
export class SetupStockroomService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: StockroomModel.IQueryString): Observable<StockroomModel.GetAllStockroom> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/stockroom`, params);
    }

    create(payload: StockroomModel.CreateStockroom): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/stockroom/insert`, payload);
    }

    update(payload: StockroomModel.UpdateStockroom): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/stockroom/update`, payload);
    }

    delete(id_stockroom: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/stockroom/${id_stockroom}`);
    }
}
