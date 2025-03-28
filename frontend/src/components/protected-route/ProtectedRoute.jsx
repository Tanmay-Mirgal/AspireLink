import React from "react";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <div>{children}</div>;
};

export default ProtectedRoute;
