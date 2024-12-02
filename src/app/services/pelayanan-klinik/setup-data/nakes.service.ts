import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { NakesModel } from 'src/app/model/pages/setup-data/nakes.model';

@Injectable({
    providedIn: 'root'
})
export class NakesService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: NakesModel.INakesQueryParams): Observable<NakesModel.GetAllNakes> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-nakes/getAll`, query)
            .pipe(
                map((result: any) => {
                    result.data.rows = result.data.rows ? this.onMapResultGetAll(result.data.rows) : [];
                    return result;
                })
            )
    }

    getAllActive(query: NakesModel.INakesQueryParams): Observable<NakesModel.GetAllNakes> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-nakes/getForLookUp`, query)
            .pipe(
                map((result: any) => {
                    result.data.rows = result.data.rows ? this.onMapResultGetAll(result.data.rows) : [];
                    return result;
                })
            )
    }

    private onMapResultGetAll(data: any) {
        return data.map((item: any) => {
            return {
                id_nakes: item.id_nakes,
                nik: item.nik,
                nama: item.nama,
                file_foto_name: item.file_foto_name,
                file_foto_url: item.file_foto_url,
                id_jabatan: item.id_jabatan,
                nama_jabatan: item.jabatan.nama_jabatan,
                id_poli: item.id_poli,
                nama_poli: item.poli.nama_poli,
                id_role: item.id_role,
                nama_role: item.role.nama_role,
                username: item.username,
                password: item.password,
                kode_dpjp: item.kode_dpjp,
                id_satu_sehat: item.id_satu_sehat,
                hfis: item.hfis,
                is_active: item.is_active,
            }
        })
    }

    getById(id_nakes: string): Observable<NakesModel.GetByIdNakes> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-nakes/getById/${id_nakes}`);
    }

    create(payload: NakesModel.CreateNakes): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_nakes'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-nakes/create`, payload);
    }

    update(payload: NakesModel.UpdateNakes): Observable<HttpBaseResponse> {
        const { id_nakes, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-nakes/update/${payload.id_nakes}`, data);
    }

    updateStatus(payload: NakesModel.UpdateNakes): Observable<HttpBaseResponse> {
        const { id_nakes, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-nakes/update/${id_nakes}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_nakes: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-nakes/delete/${id_nakes}`);
    }
}
