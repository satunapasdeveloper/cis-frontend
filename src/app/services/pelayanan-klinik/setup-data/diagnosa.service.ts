import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { DiagnosaModel } from 'src/app/model/pages/setup-data/diagnosa.model';

@Injectable({
    providedIn: 'root'
})
export class DiagnosaService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: DiagnosaModel.IDiagnosaQueryParams): Observable<DiagnosaModel.GetAllDiagnosa> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-diagnosa/getAll`, query);
    }

    getAllActive(query: DiagnosaModel.IDiagnosaQueryParams): Observable<DiagnosaModel.GetAllDiagnosa> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-diagnosa/getForLookUp`, query);
    }

    getById(id_diagnosa: string): Observable<DiagnosaModel.GetByIdDiagnosa> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-diagnosa/getById/${id_diagnosa}`);
    }

    create(payload: DiagnosaModel.CreateDiagnosa): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_diagnosa'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-diagnosa/create`, payload);
    }

    update(payload: DiagnosaModel.UpdateDiagnosa): Observable<HttpBaseResponse> {
        const { id_diagnosa, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-diagnosa/update/${payload.id_diagnosa}`, data);
    }

    updateStatus(payload: DiagnosaModel.UpdateDiagnosa): Observable<HttpBaseResponse> {
        const { id_diagnosa, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-diagnosa/update/${id_diagnosa}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_diagnosa: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-diagnosa/delete/${id_diagnosa}`);
    }
}
