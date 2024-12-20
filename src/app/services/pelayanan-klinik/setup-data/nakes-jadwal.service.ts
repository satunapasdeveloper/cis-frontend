import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { NakesJadwalModel } from 'src/app/model/pages/setup-data/nakes-jadwal.model';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class NakesJadwalService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: NakesJadwalModel.IJadwalNakesQueryParams): Observable<NakesJadwalModel.GetAllJadwalNakes> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-nakes-jadwal/getAll`, query);
    }

    getByPoliAndHari(id_poli: string, id_hari: string): Observable<NakesJadwalModel.GetAllJadwalNakes> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-nakes-jadwal/getJadwalByPoliAndHari/${id_poli}/${id_hari}`);
    }

    create(payload: NakesJadwalModel.CreateJadwalNakes): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_nakes_jadwal'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-nakes-jadwal/create`, payload);
    }

    update(payload: NakesJadwalModel.UpdateJadwalNakes): Observable<HttpBaseResponse> {
        const { id_nakes_jadwal, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-nakes-jadwal/update/${id_nakes_jadwal}`, data);
    }

    updateStatus(payload: NakesJadwalModel.UpdateJadwalNakes): Observable<HttpBaseResponse> {
        const { id_nakes_jadwal, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-nakes-jadwal/update/${id_nakes_jadwal}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
