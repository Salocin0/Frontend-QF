import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const PrivateRoute = ({ children, requiredRoles, redirectTo = "/login" }) => {
  const { user } = useContext(UserContext);

  // No autenticado
  if (!user || !user.tipoUsuario) {
    return <Navigate to={redirectTo} replace />;
  }

  // Rol incorrecto
  if (requiredRoles && !requiredRoles.includes(user.tipoUsuario)) {
    return <Navigate to="/inicio" replace />;
  }

  // OK
  return children;
};

export default PrivateRoute;
