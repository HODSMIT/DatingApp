import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../service/account-service';
import { ToastService } from '../service/toast-service';

export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const toast = inject(ToastService);
  
  if(accountService.CurrentUser())
  return true;
  else{
    toast.error('You Shall Not Pass');
    return false;
  }
};
