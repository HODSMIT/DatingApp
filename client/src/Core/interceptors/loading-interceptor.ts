import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../service/busy-service';
import { delay, finalize, of, tap } from 'rxjs';
const cache = new Map<string,HttpEvent<unknown>>(); 


export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  const generateKyey = (url: string , params:HttpParams): string => {
    const paramString = params.keys().map(key => `${key}=${params.get(key)} `).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }
  
  const invalidateCache = (urlParttern: string ) => {
     for(const key of cache.keys()){
      if(key.includes(urlParttern)){
        cache.delete(key);
        console.log(`Cache invaliddate for: ${key}`) 
      }
     }
  }

  const cacheKey =  generateKyey(req.url,req.params);
  if(req.method.includes('POST') && req.url.includes('/likes')){
    invalidateCache('/likes')

  }

  if(req.method.includes('POST') && req.url.includes('/messages')){
    invalidateCache('/messages')

  }

  if(req.method === 'GET'){
    const cachedResponse = cache.get(cacheKey);
    if(cachedResponse){
      return of(cachedResponse);
    }
  }
  busyService.busy();
  return next(req).pipe(
    delay(500),
    tap(respnse =>{
      cache.set(cacheKey,respnse)
    }),
    finalize(() => 
    {
      busyService.idle()
    })
  );
};
