import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class TransferTempatTidurService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_register: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-bed-transfer/getAll/${id_register}`);
    }

    getById(id_bed_transfer: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-bed-transfer/getById/${id_bed_transfer}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_bed_transfer'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-bed-transfer/create`, payload);
    }

    approve(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-bed-transfer/approve`, payload);
    }

    cancel(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-bed-transfer/cancel`, payload);
    }
}
