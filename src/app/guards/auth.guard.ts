import {CanActivateFn, Router, RouterModule} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {


  let authService:AuthService = inject(AuthService);
  let routerServuce: Router  = inject(Router);
  let role = route.data['role'];

  return authService.getUserDataAuth().pipe(
    map(({user,person})=>{
      if(user){

        if(person){
          if(person.role && person.role==role||role=="*"){
            return true;
          }else{
            routerServuce.navigate(["/tasks"])
            return false;
          }
        }else{
          routerServuce.navigate(["/login"])
          return false;
        }
      }else{
        routerServuce.navigate(["/login"])
        return false
      }
    }),
    catchError((error,caught)=>{
      routerServuce.navigate(["/login"])
      return of(false)
    })
  );

};
