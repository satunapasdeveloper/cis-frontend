import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../http/http-request.service';
import { map, Observable } from 'rxjs';
import { PoliModel } from 'src/app/model/pages/setup-data/poli.model';
import { environment } from 'src/environments/environment';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class PoliService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: PoliModel.IPoliQueryParams): Observable<PoliModel.GetAllPoli> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-poli/getAll`, query)
            .pipe(
                map((result) => {
                    if (result.data.rows.length) {
                        result.data.rows = result.data.rows.map((item: any) => {
                            return {
                                ...item,
                                nama_unit: item.unit.nama_unit
                            }
                        });
                    }

                    return result;
                })
            )
    }

    getAllActive(query: PoliModel.IPoliQueryParams): Observable<PoliModel.GetAllPoli> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-poli/getForLookUp`, query);
    }

    create(payload: PoliModel.CreatePoli): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-poli/create`, payload);
    }

    update(payload: PoliModel.UpdatePoli): Observable<HttpBaseResponse> {
        const { id_poli, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-poli/update/${payload.id_poli}`, data);
    }

    updateStatus(payload: PoliModel.UpdatePoli): Observable<HttpBaseResponse> {
        const { id_poli, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-poli/update/${id_poli}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-poli/delete/${uuid}`);
    }
}
