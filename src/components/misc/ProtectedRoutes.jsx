import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Element, user, role, ...rest }) => {
  console.log(user);
  return user && user.role === role ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
