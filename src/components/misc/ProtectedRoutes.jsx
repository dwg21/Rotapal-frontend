import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  element: Element,
  user,
  acceptedRoles = [],
  ...rest
}) => {
  console.log(user);
  return user && acceptedRoles.includes(user.role) ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
