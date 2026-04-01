import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type GuardProps = {
  children: React.ReactElement;
};

type PublicRouteProps = GuardProps & {
  redirectAuthenticatedTo?: string;
};

export const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#0D1117]" />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectAuthenticatedTo,
}) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#0D1117]" />;
  }

  if (currentUser && redirectAuthenticatedTo) {
    return <Navigate to={redirectAuthenticatedTo} replace />;
  }

  return children;
};

