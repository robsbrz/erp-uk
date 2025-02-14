export type UserRole = 'admin' | 'manager' | 'user';

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface UserPermissions {
  products: Permission;
  customers: Permission;
  invoices: Permission;
  users: Permission;
  reports: Permission;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    products: { create: true, read: true, update: true, delete: true },
    customers: { create: true, read: true, update: true, delete: true },
    invoices: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true }
  },
  manager: {
    products: { create: true, read: true, update: true, delete: false },
    customers: { create: true, read: true, update: true, delete: false },
    invoices: { create: true, read: true, update: true, delete: false },
    users: { create: false, read: true, update: false, delete: false },
    reports: { create: true, read: true, update: true, delete: false }
  },
  user: {
    products: { create: false, read: true, update: false, delete: false },
    customers: { create: true, read: true, update: true, delete: false },
    invoices: { create: true, read: true, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false }
  }
};
