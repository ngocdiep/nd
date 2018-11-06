import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services';


@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(
        private tokenService: TokenService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const token = this.tokenService.getToken();
        if (token) {
            console.log('token: ' + token);

            const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
            console.log('Authorization header: ' + authReq.headers.get('Authorization'));

            return next.handle(authReq);
        }

        return next.handle(req);
    }
}
