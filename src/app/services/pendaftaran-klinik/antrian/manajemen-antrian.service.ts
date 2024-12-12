import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../http/http-request.service';
import { ManajemenAntrianModel } from 'src/app/model/pages/pendaftaran/manajemen-antrian.model';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ManajemenAntrianService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    panggil(id_loket: number): Observable<ManajemenAntrianModel.PanggilAntrian> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-antrian/panggilAntrian/${id_loket}`)
            .pipe(
                map((result) => {
                    if (result.responseResult && result.data) {
                        result.data = {
                            id_antrian: result.data.id_antrian,
                            no_antrian: result.data.no_antrian,
                            id_antrian_jenis: result.data.id_antrian_jenis,
                            jenis_antrian: result.data.antrian_jenis.jenis_antrian,
                            id_antrian_status: result.data.id_antrian_status,
                            status_antrian: result.data.antrian_status.status_antrian,
                            created_at: result.data.created_at,
                            id_loket: result.data.id_loket,
                            calling_at: result.data.calling_at,
                            is_calling_now: result.data.is_calling_now,
                            id_pendaftaran: result.data.id_pendaftaran,
                            start_admisi_at: result.data.start_admisi_at,
                            start_admisi_by: result.data.start_admisi_by,
                            end_admisi_at: result.data.end_admisi_at,
                            end_admisi_by: result.data.end_admisi_by,
                        }
                    };

                    return result;
                })
            )
    }

    skip(id_loket: number): Observable<ManajemenAntrianModel.SkipAntrian> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-antrian/skipAntrian/${id_loket}`)
            .pipe(
                map((result) => {
                    if (result.responseResult) {
                        result.data = {
                            id_antrian: result.data.id_antrian,
                            no_antrian: result.data.no_antrian,
                            id_antrian_jenis: result.data.id_antrian_jenis,
                            jenis_antrian: result.data.antrian_jenis.jenis_antrian,
                            id_antrian_status: result.data.id_antrian_status,
                            status_antrian: result.data.antrian_status.status_antrian,
                            created_at: result.data.created_at,
                            id_loket: result.data.id_loket,
                            calling_at: result.data.calling_at,
                            is_calling_now: result.data.is_calling_now,
                            id_pendaftaran: result.data.id_pendaftaran,
                            start_admisi_at: result.data.start_admisi_at,
                            start_admisi_by: result.data.start_admisi_by,
                            end_admisi_at: result.data.end_admisi_at,
                            end_admisi_by: result.data.end_admisi_by,
                        }
                    }
                    return result;
                })
            )
    }

    getAntrianTerlewati(id_loket: number) {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-antrian/getAntrianTerlewati/${id_loket}`)
    }

    panggilUlang(id_antrian: number) {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-antrian/getAntrianById/${id_antrian}`)
            .pipe(
                map((result) => {
                    if (result.responseResult && result.data) {
                        result.data = {
                            id_antrian: result.data.id_antrian,
                            no_antrian: result.data.no_antrian,
                            id_antrian_jenis: result.data.id_antrian_jenis,
                            jenis_antrian: result.data.antrian_jenis.jenis_antrian,
                            id_antrian_status: result.data.id_antrian_status,
                            status_antrian: result.data.antrian_status.status_antrian,
                            created_at: result.data.created_at,
                            id_loket: result.data.id_loket,
                            calling_at: result.data.calling_at,
                            is_calling_now: result.data.is_calling_now,
                            id_pendaftaran: result.data.id_pendaftaran,
                            start_admisi_at: result.data.start_admisi_at,
                            start_admisi_by: result.data.start_admisi_by,
                            end_admisi_at: result.data.end_admisi_at,
                            end_admisi_by: result.data.end_admisi_by,
                        }
                    };

                    return result;
                })
            )
    }

    startAdmisi(id_antrian: number) {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-antrian/startAdmisi/${id_antrian}`, null)
    }

    stopAdmisi(id_antrian: number) {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-antrian/endAdmisi/${id_antrian}`, null)
    }

    getDetailAntrian(no_antrian: string, tanggal: string) {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-antrian/getAntrianByNomorAndDate/${no_antrian}/${tanggal}`)
            .pipe(
                map((result) => {
                    if (result.responseResult && result.data) {
                        result.data = {
                            id_antrian: result.data.id_antrian,
                            no_antrian: result.data.no_antrian,
                            id_antrian_jenis: result.data.id_antrian_jenis,
                            jenis_antrian: result.data.antrian_jenis.jenis_antrian,
                        }
                    }
                    return result;
                })
            )
    }
}
