import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { LoketModel } from 'src/app/model/pages/pendaftaran/setup-loket.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupLoketService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllJenisAntrian() {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-antrian-jenis/getForLookUp`, { page: 1, count: 100 });
    }

    getAll(query: LoketModel.ILoketQueryParams): Observable<LoketModel.GetAllLoket> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-loket/getAll`, query)
            .pipe(
                map((result) => {
                    result.data.rows = this.onMappingResult(result.data.rows);
                    return result;
                })
            )
    }

    getAllActive(query: LoketModel.ILoketQueryParams): Observable<LoketModel.GetAllLoket> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-loket/getForLookUp`, query)
            .pipe(
                map((result) => {
                    return this.onMappingResult(result);
                })
            )
    }

    private onMappingResult(data: any) {
        return data.map((item: any) => {
            return {
                "id_loket": item.id_loket,
                "nama_loket": item.nama_loket,
                "id_antrian_jenis": item.id_antrian_jenis,
                "jenis_antrian": item.antrian_jenis.jenis_antrian,
                "is_active": item.is_active,
                "created_at": item.created_at,
                "created_by": item.created_by,
                "updated_at": item.updated_at,
                "updated_by": item.updated_by,
            }
        })
    }

    getById(id_loket: string): Observable<LoketModel.GetByIdLoket> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-loket/getById/${id_loket}`);
    }

    create(payload: LoketModel.CreateLoket): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_loket'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-loket/create`, payload);
    }

    update(payload: LoketModel.UpdateLoket): Observable<HttpBaseResponse> {
        const { id_loket, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-loket/update/${payload.id_loket}`, data);
    }

    updateStatus(payload: LoketModel.UpdateLoket): Observable<HttpBaseResponse> {
        const { id_loket, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-loket/update/${id_loket}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_loket: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-loket/delete/${id_loket}`);
    }
}
