import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PendaftaranRawatInapService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/getAll`, { jenis_rawat: 'I', ...query })
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
                                    diagnosa_primer: item.diagnosa_primer ? item.diagnosa_primer.nama_icd_10 : ''
                                }
                            })
                    }

                    return result;
                })
            )
    }

    getByIdRegister(id_register: string): Observable<any> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/getById/${id_register}`)
            .pipe(
                map((result) => {
                    if (result.data) {
                        result.data = {
                            id_register: result.data.id_register,
                            no_antrian: result.data.no_antrian,
                            no_register: result.data.no_register,
                            id_pasien: result.data.id_pasien,
                            no_rekam_medis: result.data.pasien.no_rekam_medis,
                            nama_pasien: result.data.pasien.nama_pasien,
                            gender: result.data.pasien.gender,
                            tanggal_lahir: result.data.pasien.tanggal_lahir,
                            no_telf: result.data.pasien.no_telf,
                            id_penjamin: result.data.id_penjamin,
                            nama_penjamin: result.data.penjamin.nama_penjamin,
                            status_register: result.data.status_register,
                            diagnosa_primer: result.data.diagnosa_primer.nama_icd_10,
                            tanggal_admisi: result.data.tanggal_admisi,
                            nama_dokter: result.data.dokter.nama,
                            nama_poli: result.data.poli.nama_poli
                        };
                    }

                    return result;
                })
            )
    }

    createUmum(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/createIrjaUmum`, payload);
    }

    cekPasienBpjs(id_pasien: string, no_rujukan?: string): Observable<HttpBaseResponse> {
        let query = no_rujukan ? { id_pasien: id_pasien, no_rujukan: no_rujukan } : { id_pasien: id_pasien };

        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/cekPasienBpjs`, query);
    }

    createBpjsTanpaSep(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/createIrnaBpjsTanpaSEP`, payload);
    }

    createBpjsDenganSep(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/createIrnaBpjsWithSEP`, payload);
    }

    updateRencanaPulang(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/updateRencanaPulang`, payload);
    }

    updatePerintahPulang(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/updatePerintahPulang`, payload);
    }

    cancel(id_register: any, reason_canceled: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-pendaftaran-irna/batalAdmisi/${id_register}/${reason_canceled}`, null);
    }
}
