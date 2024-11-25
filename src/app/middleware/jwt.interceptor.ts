import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const WebApiUrl = httpRequest.url.startsWith(`${environment.webApiUrl}`);

        const userData = localStorage.getItem("_CISUD_");

        if (userData && WebApiUrl) {
            const UserData = JSON.parse(userData)

            const modifiedRequest = httpRequest.clone({
                setHeaders: {
                    // Authorization: `Bearer ${UserData.token}`
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjozLCJuYW1hIjoidHJpYXMiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWRfbGF5YW5hbiI6IjQiLCJ1dWlkX2xheWFuYW4iOiIwZDRiZDEyZC04NzUzLTQwYmQtOTEyNy1lYWRhNDhmNGM4NTQiLCJuYW1hX2xheWFuYW4iOiJuYW1hIGxheWFuYW4iLCJ0ZW5hbnQiOiJkYl90ZW5hbnRhIiwiaWF0IjoxNzMyMjQ4MTc0fQ.OI8KjURuoUqsW-X4ZyzWV3YIQfwPMOeT6X-Bg6SXEac`
                }
            });
            return next.handle(modifiedRequest);
        } else {
            return next.handle(httpRequest);
        }
    }
}