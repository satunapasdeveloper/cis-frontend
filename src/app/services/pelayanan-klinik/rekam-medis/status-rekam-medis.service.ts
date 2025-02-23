import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class StatusRekamMedisService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    updateStatus(payload: any): Observable<any> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/tr-pendaftaran/updateStatus`, payload);
    }

}
