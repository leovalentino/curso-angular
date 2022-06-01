import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from '../user.model';
import * as AuthAction from './auth.actions';

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new UserModel(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.authenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error ocurred';
  if (!errorRes.error || !errorRes.error.error) {
    return of(AuthActions.authenticateFail({ errorMessage }));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is invalid';
      break;
  }
  return of(AuthActions.authenticateFail({ errorMessage }));
};

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  authSignup$ = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((action) => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
          {
            email: action.email,
            password: action.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(respData => {
            this.authService.setLogoutTime(+respData.expiresIn);
          }),
          map(respData => {
            return handleAuthentication(+respData.expiresIn, respData.email, respData.localId, respData.idToken);
          }),
          catchError(errorRes => {
              return handleError(errorRes);
            }
          )
        );
      })
    )
  );

  authLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginStart),
      switchMap(action => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
          {
            email: action.email,
            password: action.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(respData => {
            this.authService.setLogoutTime(+respData.expiresIn * 1000);
          }),
          map(respData => {
            return handleAuthentication(+respData.expiresIn, respData.email, respData.localId, respData.idToken);
          }),
          catchError(errorRes => {
              return handleError(errorRes);
            }
          ));
      }),
    )
  );

  authRedirect$ =   createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap(action =>  action.redirect && this.router.navigate(['/']))
    ), { dispatch: false }
  );

  autoLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.autoLogin),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY' };
      }

      const loadedUser = new UserModel(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        //this.userSubject.next(loadedUser);
       const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
       this.authService.setLogoutTime(expirationDuration);
       return AuthAction.authenticateSuccess(
          {
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          }
        );
      }
      return { type: 'DUMMY' };
    })
    )
  );

  authLogout$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    ),
    {dispatch: false}
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}

}
