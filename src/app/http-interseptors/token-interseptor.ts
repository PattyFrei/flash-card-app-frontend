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

// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikh6dHJBenNJdHZHNXN0Q0tVNW1WVSJ9.eyJpc3MiOiJodHRwczovL2ZsYXNoY2FyZGFwcC5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWYwYjBlOGJiYjMzMTMwMDEzYTNkZjNkIiwiYXVkIjpbImZsYXNoY2FyZCIsImh0dHBzOi8vZmxhc2hjYXJkYXBwLmV1LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1OTQ1ODMxNjEsImV4cCI6MTU5NDY2OTU2MSwiYXpwIjoiUjVzeHgyTFlBR0NxMkdzNlBEQUlLdnMxSWJBMkd6R0EiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.N-RkjqX98IMhi5i8_SqiIZ9sxHD2pS1M36HIcgR3YT94l4OKTfP2C_dwmeYtNHyI1TKKewTirQ7MwwEz8k_IqwIAFicTALcD6TzJJDHk6U5HCYpupPrT_ZLXDLOZbwRk8de0430fM5OoBR2JsHq82_fLeZ021lnOJfcYnqIy-Z5HOl_U-deb5bw4wBegFK5Pf0H02pNvcN6S0qhW8z-cYnty1MbvY6JDTIkDI8fXuSLM0yUHVWZP7gbta3kK1KSRZJgTObweywt3RvUSpUBikhCN4RraeUiUWC7q-Ouxe2SBEqwZ5RHwXJTByvub7Mp7BWC4WjbgXN7poopww4dvuQ
