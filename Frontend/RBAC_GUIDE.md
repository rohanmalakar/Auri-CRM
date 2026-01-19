# OrgUser Role-Based Access Control (RBAC)

## Overview
The OrgUser authentication system now uses a **designation-based** role system instead of the old `is_org_admin` or `type` fields.

## User Designations

### Available Roles
- **Admin** - Full access to all features
- **Manager** - Elevated permissions (can manage users, edit org, view reports)
- **Cashier** - Restricted access (view-only for most features)
- **Other** - Custom role with default permissions

## Updated Authentication Response

### New Login Response Structure
```typescript
{
  org_user_id: string;
  name: string;
  email: string;
  org_id: string;
  branch_id?: string;
  designation: 'Cashier' | 'Manager' | 'Admin' | 'Other';
  access_token: string;
  refresh_token: string;
}
```

### OrgUser Interface
```typescript
export interface OrgUser {
  org_user_id: string;
  name: string;
  email: string;
  org_id: string;
  branch_id?: string;
  designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
  access_token?: string;
  refresh_token?: string;
}
```

## How to Check User Roles

### Method 1: Direct Designation Check
```typescript
import { useAppSelector } from '@/redux/hooks';

const { user } = useAppSelector((state) => state.orgAuth);

// Check if Admin
const isAdmin = user?.designation === 'Admin';

// Check if Manager
const isManager = user?.designation === 'Manager';

// Check if Cashier
const isCashier = user?.designation === 'Cashier';

// Check if Admin or Manager (common pattern)
const isAdminOrManager = user?.designation === 'Admin' || user?.designation === 'Manager';
```

### Method 2: Using Helper Functions
```typescript
import { permissions, isCashier, isAdminOrManager } from '@/utils/roleHelpers';
import { useAppSelector } from '@/redux/hooks';

const { user } = useAppSelector((state) => state.orgAuth);

// Check specific permissions
if (permissions.canManageUsers(user)) {
  // Show user management features
}

// Restrict functionality for cashiers
if (isCashier(user)) {
  // Show limited UI for cashiers
}
```

## Examples of Restricting Functionality

### 1. Hide Features from Cashiers
```typescript
const { user } = useAppSelector((state) => state.orgAuth);
const isCashier = user?.designation === 'Cashier';

// Conditionally render components
{!isCashier && (
  <Button onClick={handleDelete}>Delete User</Button>
)}
```

### 2. Disable Buttons for Cashiers
```typescript
<Button 
  disabled={user?.designation === 'Cashier'}
  onClick={handleEditOrganization}
>
  Edit Organization
</Button>
```

### 3. Restrict Entire Pages
```typescript
const isAdminOrManager = user?.designation === 'Admin' || user?.designation === 'Manager';

if (!isAdminOrManager) {
  return (
    <Card>
      <CardContent>
        <h3>Access Restricted</h3>
        <p>Only Admins and Managers can access this page.</p>
      </CardContent>
    </Card>
  );
}

// Render normal page content
return <div>...</div>;
```

### 4. Navigation Menu Restrictions
```typescript
const nav = [
  { name: "Dashboard", path: "/org/dashboard", icon: Home },
  { 
    name: "Users", 
    path: "/org/users", 
    icon: Users,
    adminOnly: true // Will be filtered out for Cashiers
  },
  { name: "Reports", path: "/org/reports", icon: FileText },
];

const isAdminOrManager = user?.designation === 'Admin' || user?.designation === 'Manager';
const filteredNav = nav.filter(item => !item.adminOnly || isAdminOrManager);
```

### 5. Form Field Restrictions
```typescript
<Input
  name="price"
  disabled={user?.designation === 'Cashier'}
  value={price}
  onChange={handleChange}
/>
```

## Permission Matrix

| Feature | Admin | Manager | Cashier | Other |
|---------|-------|---------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ✅ | ❌ | ❌ |
| Edit Organization | ✅ | ✅ | ❌ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ |
| Export Reports | ✅ | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ |
| Process Refunds | ✅ | ✅ | ❌ | ❌ |
| Access Settings | ✅ | ✅ | ❌ | ❌ |

## Files Updated

### Core Authentication
- `src/redux/features/orgAuth/orgAuthSlice.ts` - Updated OrgUser interface and helper functions
- `src/OrgUser/Auth/Login.tsx` - Updated to use new API response structure

### Components with Role Checks
- `src/OrgUser/Layouts/Layouts.tsx` - Navigation filtering based on designation
- `src/OrgUser/Pages/dashboard/Dashboard.tsx` - Role display and permissions
- `src/OrgUser/Pages/users/UserManagement.tsx` - Restricted to Admin/Manager
- `src/OrgUser/Pages/organization/OrganizationEdit.tsx` - Restricted to Admin/Manager
- `src/OrgUser/Pages/organization/OrganizationInfo.tsx` - View-based restrictions

### Utilities
- `src/utils/roleHelpers.ts` - Helper functions for role checking and permissions

## Migrating from Old System

### Old Code (is_org_admin)
```typescript
❌ const isOrgAdmin = user?.is_org_admin || user?.type === 'admin';
```

### New Code (designation)
```typescript
✅ const isAdminOrManager = user?.designation === 'Admin' || user?.designation === 'Manager';
```

## Best Practices

1. **Always check designation** before allowing sensitive operations
2. **Use helper functions** from `roleHelpers.ts` for consistency
3. **Provide clear feedback** when access is restricted
4. **Test with different roles** to ensure proper restrictions
5. **Document role requirements** for new features

## Common Patterns

### Pattern 1: Conditional Rendering
```typescript
{isAdminOrManager(user) && <AdminFeature />}
```

### Pattern 2: Early Return
```typescript
if (!isAdminOrManager(user)) {
  return <AccessDeniedMessage />;
}
```

### Pattern 3: Disabled State
```typescript
disabled={!permissions.canEditUser(user)}
```

### Pattern 4: Route Guards
```typescript
// In ProtectedOrgRoutes component
if (isCashier(user) && route.requiresAdmin) {
  return <Navigate to="/org/dashboard" />;
}
```
