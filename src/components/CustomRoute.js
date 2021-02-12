import React from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const CustomRoute = ({ children, auth, ...rest }) => {
  const user = useUser();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        (auth ? user : !user) ? (
          children
        ) : (
          <Redirect
            exact 
            to={{
              pathname: auth ? "/login" : "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default CustomRoute;
