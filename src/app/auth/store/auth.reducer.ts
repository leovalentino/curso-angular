import {UserModel} from '../user.model';
import * as AuthActions from './auth.ations';

export interface State {
  user: UserModel;
  authError: string;
  loading: boolean;
}

const initialState = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new UserModel(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        authError: null,
        user: user,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        loading: true
      };
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        authError: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
