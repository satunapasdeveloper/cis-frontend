import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { SupplierModel } from 'src/app/model/pages/farmasi/setup-data/setup-supplier.model';

@Injectable({
    providedIn: 'root'
})
export class SetupSupplierService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: SupplierModel.IQueryString): Observable<SupplierModel.GetAllSupplier> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/supplier/getAllPaginate`, params);
    }

    create(payload: SupplierModel.CreateSupplier): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/supplier/insert`, payload);
    }

    update(payload: SupplierModel.UpdateSupplier): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/supplier/update`, payload);
    }

    delete(id_supplier: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/supplier/deactived/${id_supplier}`);
    }
}
