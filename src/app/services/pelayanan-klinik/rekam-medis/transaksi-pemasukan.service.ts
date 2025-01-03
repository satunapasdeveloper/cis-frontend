import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { TransaksiPemasukanModel } from 'src/app/model/pages/rekam-medis/transaksi-pemasukan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class TransaksiPemasukanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_register: string): Observable<TransaksiPemasukanModel.GetAll> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-detail-tindakan-medis/getByIdRegister/${id_register}`)
            .pipe(
                map((result) => {
                    if (result.responseResult) {
                        result.data = result.data.map((item: any) => {
                            return {
                                "id_transaksi": item.id_transaksi,
                                "id_register": item.id_register,
                                "id_order_penunjang": item.id_order_penunjang,
                                "tanggal_transaksi": item.tanggal_transaksi,
                                "id_tarif_berlaku": item.id_tarif_berlaku,
                                "id_tarif": item.id_tarif,
                                "nama_tarif": item.tarif.nama_tarif,
                                "id_dokter": item.id_dokter,
                                "nama_dokter": item.dokter.nama,
                                "id_perawat": item.id_perawat,
                                "id_poli": item.id_poli,
                                "nama_poli": item.poli.nama_poli,
                                "qty": item.qty,
                                "harga": item.harga,
                                "diskon_dokter": item.diskon_dokter,
                                "subtotal": item.subtotal,
                                "status": item.status,
                            }
                        })
                    }

                    return result;
                })
            )
    }

    getById(id_transaksi: string): Observable<TransaksiPemasukanModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-detail-tindakan-medis/getById/${id_transaksi}`);
    }

    create(payload: TransaksiPemasukanModel.Create): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_transaksi'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-detail-tindakan-medis/insert`, payload);
    }

    update(payload: TransaksiPemasukanModel.Update): Observable<HttpBaseResponse> {
        const { id_transaksi, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-detail-tindakan-medis/update/${id_transaksi}`, data);
    }

    cancel(payload: TransaksiPemasukanModel.Cancel): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/tr-detail-tindakan-medis/cancel/${payload.id_transaksi}/${payload.reason_canceled}`, null);
    }
}
