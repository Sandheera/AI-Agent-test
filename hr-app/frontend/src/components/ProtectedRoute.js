import React from 'react';
import { Alert } from 'react-bootstrap';

const ProtectedRoute = ({ user, requiredRoles, children }) => {
  if (!user) {
    return <Alert variant="danger">Please login first</Alert>;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Alert variant="danger">You don't have permission to access this page</Alert>;
  }

  return children;
};

export default ProtectedRoute;
