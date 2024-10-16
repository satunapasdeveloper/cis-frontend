import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http/http-request.service';
import { BerandaModel } from 'src/app/model/pages/beranda/beranda.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BerandaService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<BerandaModel.GetAllDashboard> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/Dashboard/Index`);
    }
}
