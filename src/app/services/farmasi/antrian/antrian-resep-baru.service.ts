import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class AntrianResepBaruService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllForBackoffice(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-resep/getResepForFarmasiBackOffice`, query)
    }

    getAllForLoket(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-resep/getResepForFarmasi`, query)
    }

    getByIdRegister(id_register: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-resep/getResepGroupByRegister/${id_register}`)
    }

    panggil(id_register: number): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-resep/panggilAntrianFarmasi/${id_register}`)
    }
}
