import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,User,UserCredential
} from '@angular/fire/auth';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {

  }


  register({email, password}:any){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({email, password}: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable((observer) => {
      onAuthStateChanged(
        this.auth,
        (user) => {
          observer.next(!!user); // true si hay usuario, false si no
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getUserAuthenticated(): Observable<User|null> {
    return new Observable((observer) => {
      onAuthStateChanged(
        this.auth,
        (user) => {
          observer.next(user);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
