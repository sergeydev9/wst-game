export { default as GuardedRoute } from "./guarded-route/GuardedRoute";
export {
  default as authReducer,
  authSlice,
  isLoggedIn,
  login,
  logout
} from "./auth/authSlice";
export { default as modalReducer, closeModals, openLogin, openCreateAcc, selectCreateAcc, selectLoginOpen } from './modal/modalSlice';
export { default as gameReducer } from './game/gameSlice';
export * from './choose-name/chooseNameSlice';
