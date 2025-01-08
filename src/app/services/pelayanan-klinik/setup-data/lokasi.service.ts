import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LokasiModel } from 'src/app/model/pages/setup-data/lokasi.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class LokasiService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getProvinsi(): Observable<LokasiModel.GetProvinsi> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-lokasi/getProvinsi`, { page: 1, count: 100 });
    }

    getKota(id_provinsi: string): Observable<LokasiModel.GetKota> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-lokasi/getKota`, { page: 1, count: 1000, id_provinsi: id_provinsi });
    }

    getKecamatan(id_kota: string): Observable<LokasiModel.GetKecamatan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-lokasi/getKecamatan`, { page: 1, count: 1000, id_kota: id_kota });
    }

    getKelurahan(id_kecamatan: string): Observable<LokasiModel.GetKelurahan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-lokasi/getKelurahan`, { page: 1, count: 1000, id_kecamatan: id_kecamatan });
    }
}
