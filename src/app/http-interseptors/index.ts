import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiUrlInterceptor } from './apiurl-interceptor';
import { TokenInterseptorService } from './token-interseptor';

// in outside-in order
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterseptorService,
    multi: true,
  },
];
