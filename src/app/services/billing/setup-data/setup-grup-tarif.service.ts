import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { SetupGrupTarifModel } from 'src/app/model/pages/billing/setup-data/setup-grup-tarif.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class SetupGrupTarifService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getJenisTarif(): Observable<any> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-grup/getJenisTarif`);
    }

    getAll(jenis_tarif: string): Observable<SetupGrupTarifModel.GetAll> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/setup-tarif-grup/getAll/${jenis_tarif}`)
            .pipe(map((res: any) => {
                return {
                    ...res,
                    data: this.onFormatToPanelMenuData(res.data)
                };
            }));
    }

    private onFormatToPanelMenuData(data: any[]): any {
        return data.map((item: any) => {
            return {
                label: item.nama_tarif_grup,
                icon: 'pi pi-folder',
                items: item.child.length > 0 ? this.onFormatToPanelMenuData(item.child) : [],
                id_tarif_grup: item.id_tarif_grup,
                id_tarif_grup_parent: item.id_tarif_grup_parent,
                kode_tarif_grup: item.kode_tarif_grup,
                nama_tarif_grup: item.nama_tarif_grup,
            };
        });
    }

    getById(id_tarif_grup: string): Observable<SetupGrupTarifModel.GetAll> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/setup-tarif-grup/getById/${id_tarif_grup}`);
    }

    createChild(payload: SetupGrupTarifModel.CreateChild): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_tarif_grup'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-tarif-grup/createChild`, payload);
    }

    createParent(payload: SetupGrupTarifModel.CreateParent): Observable<HttpBaseResponse> {
        delete (<any>payload)['id_tarif_grup'];
        delete (<any>payload)['id_tarif_grup_parent'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/setup-tarif-grup/createParent`, payload);
    }

    update(payload: SetupGrupTarifModel.Update): Observable<HttpBaseResponse> {
        const { id_tarif_grup, ...data } = payload;
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/setup-tarif-grup/update/${payload.id_tarif_grup}`, data);
    }
}
