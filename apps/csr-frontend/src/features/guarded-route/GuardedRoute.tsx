import React from "react";

import { Route, Redirect } from "react-router-dom";
import { isLoggedIn } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";

export interface GuardedRouteProps {
  path: string;
  exact: boolean;
}

/**
 * Creates a route that will redirect to the login
 * page if the user is not logged in. Use this
 * for any user-only pages.
 *
 * @param {GuradedRouteProps} { component, path, exact }
 * @return {React.FC}
 */
const GuardedRoute: React.FC<GuardedRouteProps> = ({ path, exact, children }) => {
  const loggedIn = useAppSelector(isLoggedIn);
  return (
    loggedIn ? (
      <Route path={path} exact={exact} >
        {children}
      </Route>
    ) : (
      <Redirect to="/login" />
    )
  );
};
export default GuardedRoute;
