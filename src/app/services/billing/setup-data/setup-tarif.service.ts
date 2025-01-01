import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupTarifModel } from 'src/app/model/pages/billing/setup-data/setup-tarif.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupTarifService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllForTindakanMedis(query: SetupTarifModel.GetForTindakanMedisQueryParams): Observable<SetupTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif/lookUpForTindakanMedis`, query);
    }

    getAllActive(query: SetupTarifModel.GetAllQueryParams): Observable<SetupTarifModel.GetAll> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-tarif/getForLookUp`, query)
            .pipe(
                map((result) => {
                    if (result.responseResult) {
                        result.data.rows = result.data.rows.map((item: any) => {
                            let jenis_rawat = item.is_irja ? 'Rawat Jalan' : (item.is_irna ? 'Rawat Inap' : 'Rawat Darurat');

                            return {
                                "id_tarif": item.id_tarif,
                                "id_tarif_grup": item.id_tarif_grup,
                                "id_tarif_kelompok": item.id_tarif_kelompok,
                                "kode_tarif": item.kode_tarif,
                                "nama_tarif": item.nama_tarif,
                                "nama_tarif_kelompok": item.tarif_kelompok.nama_tarif_kelompok,
                                "jenis_rawat": jenis_rawat,
                                "is_active": item.is_active,
                                "created_at": item.created_at,
                                "created_by": item.created_by,
                                "updated_at": item.updated_at,
                                "updated_by": item.updated_by,
                            }
                        });
                    }

                    return result;
                })
            )
    }

    getById(id_tarif: string): Observable<any> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-tarif/getById/${id_tarif}`)
            .pipe(
                map((result) => {
                    if (result.responseResult) {
                        result.data = {
                            id_tarif: result.data.id_tarif,
                            id_tarif_grup: result.data.id_tarif_grup,
                            nama_tarif_grup: result.data.tarif_grup.nama_tarif_grup,
                            id_tarif_kelompok: result.data.id_tarif_kelompok,
                            nama_tarif_kelompok: result.data.tarif_kelompok.nama_tarif_kelompok,
                            kode_tarif: result.data.kode_tarif,
                            nama_tarif: result.data.nama_tarif,
                            is_active: result.data.is_active,
                            detail_kelas: result.data.detail_berlaku.map((item: any) => {
                                return {
                                    id_kelas: item.kelas.id_kelas,
                                    nama_kelas: item.kelas.nama_kelas,
                                    nominal_tarif: item.nominal_tarif,
                                }
                            }),
                            detail_poli: result.data.detail_berlaku_poli.map((item: any) => {
                                return item.poli.id_poli
                            })
                        }
                    }

                    return result;
                })
            )
    }

    create(payload: SetupTarifModel.Create): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_tarif'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-tarif/create`, payload);
    }

    update(payload: SetupTarifModel.Update): Observable<HttpBaseResponse> {
        const { id_tarif, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-tarif/update/${id_tarif}`, data);
    }

    updateStatus(payload: SetupTarifModel.Update): Observable<HttpBaseResponse> {
        const { id_tarif, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-tarif/updateStatus/${id_tarif}`,
            {
                is_active: !payload.is_active
            }
        );
    }
}
