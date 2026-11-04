import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isLogin = req.url.includes('/auth/login');
  const isRegister = req.url.includes('/users/register');

  let request = req;
  if (token && !isLogin && !isRegister) {
    request = req.clone({ setHeaders: { Authorization: 'Basic ' + token } });
  }

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isLogin && !isRegister) {
        auth.logout(true);
      }
      return throwError(() => err);
    }),
  );
};
