import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../service/account-service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const accountService = inject(AccountService);

  const user = accountService.CurrentUser();
  if (user)
  {
    req = req.clone({
      setHeaders:{
        Authorization : `Bearer ${user.token}`
      }
    })
  }
  return next(req);
};
