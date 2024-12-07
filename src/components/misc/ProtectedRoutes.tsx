import React from "react";
import { Navigate } from "react-router-dom";
import { UserData } from "../../types/user";

// Define the props for the ProtectedRoute component
interface ProtectedRouteProps {
  element: React.ReactElement; // Changed from React.ElementType to React.ReactElement
  user: UserData | null; // The user object or null if not logged in
  acceptedRoles?: string[]; // List of roles that are accepted
}

const ProtectedRoute = ({
  element,
  user,
  acceptedRoles = [],
}: ProtectedRouteProps) => {
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in but does not have an accepted role
  if (acceptedRoles.length > 0 && !acceptedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or to a "not authorized" page
  }

  // If user is logged in and has the correct role, render the element
  return element;
};

export default ProtectedRoute;
