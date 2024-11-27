import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { KamarModel } from 'src/app/model/pages/setup-data/kamar.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class KamarService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: KamarModel.IKamarQueryParams): Observable<KamarModel.GetAllKamar> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-bed-kamar/getAll`, query)
            .pipe(
                map((result) => {
                    if (result.data.rows.length) {
                        result.data.rows = result.data.rows.map((item: any) => {
                            return {
                                id_bed_kamar: item.id_bed_kamar,
                                id_bed_kategori: item.id_bed_kategori,
                                nama_kategori: item.bed_kategori.nama_kategori,
                                no_kamar: item.no_kamar,
                                label_kamar: item.label_kamar,
                                no_lantai: item.no_lantai,
                                id_poli: item.id_poli,
                                nama_poli: item.poli.nama_poli,
                                id_kelas: item.id_kelas,
                                nama_kelas: item.kelas.nama_kelas,
                                gender: item.gender,
                                keterangan: item.keterangan,
                                is_isolasi: item.is_isolasi,
                                is_active: item.is_active
                            }
                        });
                    }

                    return result;
                })
            )
    }

    getAllActive(query: KamarModel.IKamarQueryParams): Observable<KamarModel.GetAllKamar> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-bed-kamar/getForLookUp`, query)
            .pipe(
                map((result) => {
                    if (result.data.rows.length) {
                        result.data.rows = result.data.rows.map((item: any) => {
                            return {
                                id_bed_kamar: item.id_bed_kamar,
                                id_bed_kategori: item.id_bed_kategori,
                                nama_kategori: item.bed_kategori.nama_kategori,
                                no_kamar: item.no_kamar,
                                label_kamar: item.label_kamar,
                                no_lantai: item.no_lantai,
                                id_poli: item.id_poli,
                                nama_poli: item.poli.nama_poli,
                                id_kelas: item.id_kelas,
                                nama_kelas: item.kelas.nama_kelas,
                                gender: item.gender,
                                keterangan: item.keterangan,
                                is_isolasi: item.is_isolasi,
                                is_active: item.is_active
                            }
                        });
                    }

                    return result;
                })
            )
    }

    getById(id_bed_kamar: string): Observable<KamarModel.GetByIdKamar> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-bed-kamar/getById/${id_bed_kamar}`);
    }

    create(payload: KamarModel.CreateKamar): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_bed_kamar'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-bed-kamar/create`, payload);
    }

    update(payload: KamarModel.UpdateKamar): Observable<HttpBaseResponse> {
        const { id_bed_kamar, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-bed-kamar/update/${id_bed_kamar}`, data);
    }

    updateStatus(payload: KamarModel.UpdateKamar): Observable<HttpBaseResponse> {
        const { id_bed_kamar, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-bed-kamar/update/${id_bed_kamar}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }

    delete(id_bed_kamar: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/setup-bed-kamar/delete/${id_bed_kamar}`);
    }
}
