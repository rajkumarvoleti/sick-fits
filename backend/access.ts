import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// simple -> only yes or no

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session; // !!undefined = false else true
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs): boolean {
      // console.log(permission, session?.data);
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
  isAwesome({ session }: ListAccessArgs): boolean {
    return !!session?.data.name.includes('raj');
  },
};

// rule based functions
// it can return a boolena or filters
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // do they have permission
    if (!isSignedIn) return false;
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // owner?
    return { user: { id: session?.itemId } };
    // where filter
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn) return false;
    // do they have permission
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // only status
    return { status: 'Available' };
    // where filter
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn) return false;
    // do they have permission
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // owner?
    return { user: { id: session?.itemId } };
    // where filter
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn) return false;
    // do they have permission
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // owner?
    return { id: session?.itemId };
    // where filter
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    // do they have permission
    if (!isSignedIn) return false;
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // owner?
    return { order: { user: { id: session?.itemId } } };
    // where filter
  },
};
