import React from 'react';
import { useAuth } from '../../context/auth/AuthContext';
import { DEFAULT_PERMISSIONS } from '../../types/auth';

interface PermissionGuardProps {
  children: React.ReactNode;
  module: keyof typeof DEFAULT_PERMISSIONS.admin;
  action: 'create' | 'read' | 'update' | 'delete';
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  module,
  action,
  fallback = null
}) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const permissions = DEFAULT_PERMISSIONS[user.role];
  const hasPermission = permissions[module][action];

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
