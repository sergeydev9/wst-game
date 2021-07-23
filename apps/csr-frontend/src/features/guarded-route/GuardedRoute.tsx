import React from "react";

import { Route, Redirect } from "react-router-dom";
import { selectAuthStatus } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";

export interface GuardedRouteProps {
  component: React.FC;
  path: string;
  exact: boolean;
}

/**
 * Creates a route that will redirect to the login
 * page if the user is not logged in. Use this
 * for any user-only pages.
 *
 * @param {*} { component, path, exact }
 * @return {*}
 */
const GuardedRoute: React.FC<GuardedRouteProps> = ({
  component,
  path,
  exact,
}) => {
  const loggedIn = useAppSelector(selectAuthStatus);
  return (
    <>
      {loggedIn === "loggedIn" ? (
        <Route component={component} path={path} exact={exact} />
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};
export default GuardedRoute;
