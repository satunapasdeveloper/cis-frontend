import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class BillingService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllPendaftaranBelumLunas(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-pendaftaran/getAll`, { ...query, status_billing: 'BELUM LUNAS' })
            .pipe(
                map((result) => {
                    result.data.rows = result.data.rows.map((item: any) => {
                        return {
                            ...item,
                            nama_pasien: item.pasien.nama_pasien,
                            no_rekam_medis: item.pasien.no_rekam_medis,
                            nama_penjamin: item.penjamin.nama_penjamin,
                        }
                    });

                    return result;
                })
            )
    }

    getAll(query: any): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-billing/getForLookup`, query)
            .pipe(
                map((result) => {
                    result.data.rows = result.data.rows.map((item: any) => {
                        return {
                            ...item,
                            no_register: item.register.no_register,
                            nama_pasien: item.register.pasien.nama_pasien,
                            no_rekam_medis: item.register.pasien.no_rekam_medis,
                        }
                    });

                    return result;
                })
            )
    }

    getById(id_billing: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-billing/getById/${id_billing}`)
    }

    getDetailBilling(id_register: any, is_bpjs: boolean): Observable<HttpBaseResponse> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-billing/getDetailItemAllModule/${id_register}`)
            .pipe(
                map((result) => {
                    if (!Array.isArray(result.data)) {
                        return { ...result, data: [], totals: {} };
                    }

                    let totalBillingTrue = 0;
                    let totalBillingFalse = 0;

                    const updatedData = result.data.map((service: any) => {
                        if (!Array.isArray(service.detail)) {
                            return { ...service, detail: [], totalSubtotal: 0 };
                        }

                        let totalSubtotal = 0;

                        const updatedDetails = service.detail.map((item: any) => {
                            const subtotal = item.subtotal || 0;

                            // Update total subtotal per service
                            totalSubtotal += subtotal;

                            // Update total based on `is_billing`
                            if (item.is_billing) {
                                totalBillingTrue += subtotal;
                            } else {
                                totalBillingFalse += subtotal;
                            }

                            return {
                                ...item,
                                asuransi: 0,
                                iur: 0,
                                subsidi: is_bpjs ? item.subtotal : 0,
                                uniqueKey: `${service.jenis_layanan}-${item.id_reff}`
                            };
                        });

                        return {
                            ...service,
                            detail: updatedDetails,
                            total_layanan: totalSubtotal // Add total subtotal at the service level
                        };
                    });

                    return {
                        ...result,
                        data: updatedData,
                        totals: {
                            sudah_terbayar: totalBillingTrue,
                            sisa_tagihan: totalBillingFalse
                        }
                    };
                })
            );

    }

    create(payload: any) {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-billing/insert`, payload)
    }

    payment(payload: any) {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-billing/insertPembayaran`, payload)
    }
}
