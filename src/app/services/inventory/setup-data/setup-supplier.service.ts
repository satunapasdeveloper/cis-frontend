import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';
import { SupplierModel } from 'src/app/model/pages/inventory/setup-data/setup-supplier.model';

@Injectable({
    providedIn: 'root'
})
export class SetupSupplierService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(params: SupplierModel.IQueryString): Observable<SupplierModel.GetAllSupplier> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-supplier/getAll`, params);
    }

    getAllActive(params: SupplierModel.IQueryString): Observable<SupplierModel.GetAllSupplier> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-supplier/getForLookup`, params);
    }

    getById(id_supplier: string): Observable<SupplierModel.GetByIdSupplier> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-supplier/getById/${id_supplier}`);
    }

    create(payload: SupplierModel.CreateSupplier): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_supplier'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-supplier/create`, payload);
    }

    update(payload: SupplierModel.UpdateSupplier): Observable<HttpBaseResponse> {
        const { id_supplier, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-supplier/update/${id_supplier}`, data);
    }

    updateStatus(payload: SupplierModel.UpdateSupplier): Observable<HttpBaseResponse> {
        const { id_supplier, ...data } = payload;

        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-supplier/update/${id_supplier}`,
            {
                ...data,
                is_active: !payload.is_active
            }
        );
    }
}
