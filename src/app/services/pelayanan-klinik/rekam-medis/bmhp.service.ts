import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class BmhpService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(id_register: string): Observable<any> {
        const query = {
            page: 1,
            count: 100,
            id_register: id_register,
            jenis_trans: "BMHP",
        };

        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/f-penjualan-obat/findAll`, query)
            .pipe(
                switchMap((result) => {
                    const rows = result.data.rows.map((item: any) => ({
                        id_penjualan_obat: item.id_penjualan_obat,
                        tanggal_penjualan: item.tanggal_penjualan,
                        no_penjualan: item.no_penjualan,
                        id_register: item.id_register,
                        id_dokter: item.id_dokter,
                        id_stokroom: item.id_stokroom,
                        jenis_trans: item.jenis_trans,
                        status_penjualan: item.status_penjualan,
                        status_billing: item.status_billing,
                        status_delivery: item.status_delivery,
                        alamat_delivery: item.alamat_delivery,
                        is_delivery: item.is_delivery,
                        jumlah_item: item.jumlah_item,
                        biaya_kirim: item.biaya_kirim,
                        total_harga: item.total_harga,
                        created_at: item.created_at,
                        created_by: item.created_by,
                        updated_at: item.updated_at,
                        updated_by: item.updated_by,
                        canceled_at: item.canceled_at,
                        canceled_by: item.canceled_by,
                        reason_canceled: item.reason_canceled,
                        validated_at: item.validated_at,
                        validated_by: item.validated_by,
                        no_register: item.register?.no_register || null,
                        no_antrian_farmasi: item.register?.no_antrian_farmasi || null,
                        status_farmasi: item.register?.status_farmasi || null,
                        nama_pasien: item.register?.pasien?.nama_pasien || null,
                        no_rekam_medis: item.register?.pasien?.no_rekam_medis || null,
                        nik_pasien: item.register?.pasien?.nik || null,
                        nama_penjamin: item.register?.penjamin?.nama_penjamin || null,
                        nama_dokter: item.dokter?.nama || null,
                        nik_dokter: item.dokter?.nik || null,
                        kode_stokroom: item.stokroom?.kode_stokroom || null,
                        nama_stokroom: item.stokroom?.nama_stokroom || null,
                        detail_resep: [] // Placeholder untuk detail_resep
                    }));

                    // Fetch detail_resep untuk setiap id_penjualan_obat
                    const detailRequests = rows.map((row: any) =>
                        this.getById(row.id_penjualan_obat).pipe(
                            map((detailResult) => ({
                                ...row,
                                detail_resep: detailResult.data.detail_obat || [] // Tambahkan detail_resep
                            }))
                        )
                    );

                    // Tunggu semua request getById() selesai
                    return forkJoin(detailRequests).pipe(
                        map((updatedRows) => ({
                            ...result,
                            data: { rows: updatedRows }
                        }))
                    );
                })
            );
    }

    getById(id_penjualan_obat: string): Observable<any> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/f-penjualan-obat/getById/${id_penjualan_obat}`);
    }

    create(payload: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/f-penjualan-obat/insertBmhp`, payload);
    }

    validasi(id_penjualan_obat: any): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/f-penjualan-obat/validasiBmhp/${id_penjualan_obat}`, null);
    }
}
