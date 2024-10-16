import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { Observable, filter } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LaporanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getLaporanPendapatan(start: string, end: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Laporan/laporanPendapatan`, { start: start, end: end });
    }

    getLaporanPenyakit(start: string, end: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Laporan/laporanPenyakit`, { start: start, end: end });
    }

    getLaporanKunjungan(start: string, end: string, kode_icd10: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Laporan/laporanKunjungan`, { start: start, end: end, kode_icd10: kode_icd10 });
    }

    getLaporanKunjunganHarian(start: string, end: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Laporan/laporanKunjunganHarian`, { start: start, end: end });
    }

    getLaporanPemakaianObatdanBMHP(start: string, end: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/Laporan/laporanPemakaianObatdanBMHP`, { start: start, end: end });
    }
}
