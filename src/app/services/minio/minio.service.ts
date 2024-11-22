import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class MinioService {

    constructor(
        private _httpClient: HttpClient,
        private _httpRequestService: HttpRequestService,
    ) { }

    generatePresignedUrl(bucketName: string, fileName: string) {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/apk/apk_version/presignedUrl/${bucketName}/${fileName}`);
    };

    uploadFile(url: string, files: File) {
        const headers = new HttpHeaders({
            'Content-Type': files.type
        });

        return this._httpClient.put(url, files, { headers });
    };

    getUrlFile(bucketName: string, fileName: string) {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/apk/apk_version/presignedUrlGet/${bucketName}/${fileName}`);
    };
}
