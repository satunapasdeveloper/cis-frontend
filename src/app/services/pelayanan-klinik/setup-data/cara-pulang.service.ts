import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { CaraPulangModel } from 'src/app/model/pages/setup-data/cara-pulang.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class CaraPulangService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: CaraPulangModel.ICaraPulangQueryParams): Observable<CaraPulangModel.GetAllCaraPulang> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-cara-pulang/getAll`, query);
    }

    getAllActive(query: CaraPulangModel.ICaraPulangQueryParams): Observable<CaraPulangModel.GetAllCaraPulang> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-cara-pulang/getForLookUp`, query);
    }

    getById(id_cara_pulang: string): Observable<CaraPulangModel.GetByIdCaraPulang> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-cara-pulang/getById/${id_cara_pulang}`);
    }

    create(payload: CaraPulangModel.CreateCaraPulang): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_cara_pulang'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-cara-pulang/create`, payload);
    }

    update(payload: CaraPulangModel.UpdateCaraPulang): Observable<HttpBaseResponse> {
        const { id_cara_pulang, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-cara-pulang/update/${payload.id_cara_pulang}`, data);
    }

    updateStatus(payload: CaraPulangModel.UpdateCaraPulang): Observable<HttpBaseResponse> {
        const { id_cara_pulang, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-cara-pulang/update/${id_cara_pulang}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_cara_pulang: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-cara-pulang/delete/${id_cara_pulang}`);
    }
}
