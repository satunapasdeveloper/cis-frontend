import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { ManajemenUserModel } from 'src/app/model/pages/setup-data/manajemen-user.model';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class ManajemenUserService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAllRole(): Observable<ManajemenUserModel.GetAllRole> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/MsUsers/Role`);
    }

    getAll(): Observable<ManajemenUserModel.GetAllUser> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/MsUsers/GetAll`);
    }

    getAllDokter(): Observable<ManajemenUserModel.GetAllUser> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/satunapas/MsUsers/GetAll`)
            .pipe(
                map((result) => {
                    if (result.responseResult) {
                        return result.data = result.data.filter((item: ManajemenUserModel.IUser) => { return item.id_role == 1 });
                    } else {
                        return result.data = [];
                    }
                })
            )
    }

    getById(uuid: string): Observable<ManajemenUserModel.GetByIdUser> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/MsUsers/GetByUuid/${uuid}`);
    }

    create(payload: ManajemenUserModel.CreateUser): Observable<HttpBaseResponse> {
        delete (<any>payload)['uuid'];
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/MsUsers/Create`, payload);
    }

    update(uuid: string, payload: ManajemenUserModel.UpdateUser): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/MsUsers/Update/${uuid}`, payload);
    }

    updateDokter(uuid: string, payload: ManajemenUserModel.UpdateUserDokter): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/MsUsers/Update/${uuid}`, payload);
    }

    updateStatus(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/MsUsers/UpdateStatus/${uuid}`, null);
    }

    delete(uuid: string): Observable<HttpBaseResponse> {
        return this._httpRequestService.deleteRequest(`${environment.webApiUrl}/satunapas/MsUsers/Delete/${uuid}`);
    }
}
