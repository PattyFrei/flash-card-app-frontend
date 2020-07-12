import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TokenInterseptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.getTokenSilently$().pipe(
      mergeMap((token) => {
        const tokenReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        console.log(tokenReq);

        return next.handle(tokenReq);
      }),
      catchError((err) => throwError(err))
    );
  }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ZsYXNoY2FyZGFwcC5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWYwYjBlOGJiYjMzMTMwMDEzYTNkZjNkIiwiYXVkIjpbImZsYXNoY2FyZCJdLCJpYXQiOjE1OTQ1NzkzMTksImV4cCI6MTU5NDY2NTcxOSwiYXpwIjoiUjVzeHgyTFlBR0NxMkdzNlBEQUlLdnMxSWJBMkd6R0EiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.0XnnEXLKqZdHKfYfZuvWLleOIunBZWkLJritAKedKAk
