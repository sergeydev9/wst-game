export { default as GuardedRoute } from "./guarded-route/GuardedRoute";
export {
  default as authReducer,
  authSlice,
  isLoggedIn,
  login,
  logout,
  fetchDetails,
  clearError,
  selectEmail,
  selectDeckCredits,
  selectDetailsError,
  updateAccount,
  selectUpdateError
} from "./auth/authSlice";
export {
  default as modalReducer,
  closeModals,
  closeModalsThunk,
  openLogin,
  openCreateAcc,
  selectCreateAcc,
  selectLoginOpen,
  selectChangePass,
  openChangePass
} from './modal/modalSlice';
export {
  default as gameReducer,
  leaveGame,
  setAccessCode,
  setPlayerName,
  setGameStatus,
  selectAccessCode,
  selectGameStatus,
  selectPlayerName
} from './game/gameSlice';
export { default as decksReducer } from './decks/deckSlice';
export { default as AuthForm } from './auth/AuthForm';
export { default as Login } from './auth/Login';
export { default as CreateAccount } from './auth/CreateAccount';
export { default as ChangePassword } from './change-password/ChangePassword'; // The modal in the 'My Account' secion
export { default as resetPasswordReducer } from './reset-password/resetPasswordSlice'; // Reset via email code
export { default as cartReducer } from './cart/cartSlice';

export * from './choose-name/chooseNameSlice';
