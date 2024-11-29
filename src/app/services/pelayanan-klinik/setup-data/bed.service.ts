import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { BedModel } from 'src/app/model/pages/setup-data/bed.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class BedService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: BedModel.IBedQueryParams): Observable<BedModel.GetAllBed> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-bed/getAll`, query)
            .pipe(
                map((result) => {
                    if (result.data.rows.length) {
                        result.data.rows = this.onMapResultGetBed(result.data.rows);
                    }

                    return result;
                })
            )
    }

    getAllActive(query: BedModel.IBedQueryParams): Observable<BedModel.GetAllBed> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-bed/getForLookUp`, query)
            .pipe(
                map((result) => {
                    if (result.data.rows.length) {
                        result.data.rows = this.onMapResultGetBed(result.data.rows);
                    }

                    return result;
                })
            )
    }

    private onMapResultGetBed(data: any) {
        return data.map((item: any) => {
            return {
                id_bed: item.id_bed,
                id_bed_kamar: item.id_bed_kamar,
                no_kamar: item.bed_kamar.no_kamar,
                no_lantai: item.bed_kamar.no_lantai,
                no_bed: item.no_bed,
                is_tampilkan_antrian: item.is_tampilkan_antrian,
                is_sesuai_sk: item.is_sesuai_sk,
                is_active: item.is_active
            }
        })
    }

    getById(id_bed: string): Observable<BedModel.GetByIdBed> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-bed/getById/${id_bed}`);
    }

    create(payload: BedModel.CreateBed): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_bed'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-bed/create`, payload);
    }

    update(payload: BedModel.UpdateBed): Observable<HttpBaseResponse> {
        const { id_bed, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-bed/update/${id_bed}`, data);
    }

    updateStatus(payload: BedModel.UpdateBed): Observable<HttpBaseResponse> {
        const { id_bed, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-bed/update/${id_bed}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_bed: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-bed/delete/${id_bed}`);
    }
}
