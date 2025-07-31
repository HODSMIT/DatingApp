import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // ✅ withFetch import
import { InitService } from '../Core/service/init-service';
import { lastValueFrom } from 'rxjs';
import { errorInterceptor } from '../Core/interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
  provideHttpClient(withFetch(),withInterceptors([errorInterceptor])), // ✅ Keep this
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
  provideRouter(routes,withViewTransitions()),
  provideAppInitializer(async () => {
    const initservice = inject(InitService);
    return new Promise<void>((resolve) => {
      setTimeout(async () =>{
        try{
      return lastValueFrom(initservice.Init());
    }
    finally
    {
      const splash = document.getElementById('initial-splash');
      if(splash)
      {
        splash.remove();

      }
      resolve();

    }
      },500)
    })
    
  })
]

};
