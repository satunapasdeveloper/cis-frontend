import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../http/http-request.service';
import { PendaftaranModel } from 'src/app/model/pages/pendaftaran/pendaftaran.model';
import { PendaftaranRawatJalanModel } from 'src/app/model/pages/pelayanan/rawat-jalan/pendaftara-rawat-jalan.model';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class PendaftaranRawatJalanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: PendaftaranRawatJalanModel.IListPendaftaranQueryParams): Observable<PendaftaranRawatJalanModel.GetAllPendaftaran> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-pendaftaran/getAll`, { jenis_rawat: 'J', ...query })
            .pipe(
                map((result) => {
                    if (result.data.rows.length) {
                        result.data.rows = result.data.rows
                            .map((item: any) => {
                                return {
                                    id_register: item.id_register,
                                    no_antrian: item.no_antrian,
                                    no_register: item.no_register,
                                    id_pasien: item.id_pasien,
                                    no_rekam_medis: item.pasien.no_rekam_medis,
                                    nama_pasien: item.pasien.nama_pasien,
                                    gender: item.pasien.gender,
                                    tanggal_lahir: item.pasien.tanggal_lahir,
                                    no_telf: item.pasien.no_telf,
                                    id_penjamin: item.id_penjamin,
                                    nama_penjamin: item.penjamin.nama_penjamin,
                                    status_register: item.status_register,
                                }
                            })
                    }

                    return result;
                })
            )
    }

    createUmum(payload: PendaftaranRawatJalanModel.ICreateUmum): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-pendaftaran/createIrjaUmum`, payload);
    }
}