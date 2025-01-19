import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../http/http-request.service';
import { of, map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { ProcedureModel } from 'src/app/model/pages/rekam-medis/procedure.model';

@Injectable({
    providedIn: 'root'
})
export class ProcedureService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getIcd9(nama_icd_9: string): Observable<ProcedureModel.GetAllIcd9> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/icd/getIcd_9`, { page: 1, count: 50, nama_icd_9 });
    }

    getProcedure(id_register: string): Observable<ProcedureModel.GetAllProcedure> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-procedure/getByIdRegister/${id_register}`);
    }

    updateProcedure(payload: ProcedureModel.UpdateProcedure): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-procedure/update`, payload);
    }
}
