import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class PermintaanOperasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllActive(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-permintaan-operasi/lookUp`, query)
            .pipe(
                map((result) => {
                    if (result.data.rows.length) {
                        result.data.rows = result.data.rows.map((item: any) => {
                            return {
                                id_permintaan_operasi: item.id_permintaan_operasi,
                                id_register: item.id_register,
                                no_permintaan_operasi: item.no_permintaan_operasi,
                                tanggal_permintaan: item.tanggal_permintaan,
                                tanggal_approve_operasi: item.tanggal_approve_operasi,
                                tanggal_mulai_execution: item.tanggal_mulai_execution,
                                tanggal_selesai_execution: item.tanggal_selesai_execution,
                                id_rencana_anestesi: item.id_rencana_anestesi,
                                id_ruang_operasi: item.id_ruang_operasi,
                                estimasi_waktu_menit: item.estimasi_waktu_menit,
                                is_ranap_pasca_operasi: item.is_ranap_pasca_operasi,
                                is_laboratorium: item.is_laboratorium,
                                is_radiologi: item.is_radiologi,
                                status: item.status,
                                created_at: item.created_at,
                                created_by: item.created_by,
                                updated_at: item.updated_at,
                                updated_by: item.updated_by,
                                approved_at: item.approved_at,
                                approved_by: item.approved_by,
                                execution_at: item.execution_at,
                                execution_by: item.execution_by,
                                canceled_at: item.canceled_at,
                                canceled_by: item.canceled_by,
                                reason_canceled: item.reason_canceled,
                                no_register: item.register?.no_register || '',
                                id_pasien: item.register?.id_pasien || '',
                                nama_pasien: item.register?.pasien?.nama_pasien || '',
                                nik: item.register?.pasien?.nik || '',
                                no_rekam_medis: item.register?.pasien?.no_rekam_medis || '',
                                nama_ruang_operasi: item.ruang_operasi?.nama_ruang_operasi || '',
                                nama_anestesi: item.rencana_anestesi?.nama_anestesi || '',
                                detail_petugas: item.detail_petugas || []
                            };
                        });
                    }

                    return result;
                })
            )

    }

    getById(id_permintaan_operasi: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-permintaan-operasi/getById/${id_permintaan_operasi}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_permintaan_operasi'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-permintaan-operasi/create`, payload);
    }

    update(payload: any): Observable<HttpBaseResponse> {
        const { id_permintaan_operasi, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/update/${id_permintaan_operasi}`, data);
    }

    approve(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/approve`, payload);
    }

    execution(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/execution`, payload);
    }

    cancel(id_permintaan_operasi: any, reason_canceled: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-permintaan-operasi/cancel/${id_permintaan_operasi}/${reason_canceled}`, null);
    }
}
