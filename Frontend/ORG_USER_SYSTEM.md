# Organization User Management System

## Overview
This system provides a complete organization user management solution with separate authentication, layouts, and access controls for organization users and administrators.

## Features

### 1. **Dual User Types**
- **Org Admin**: Full administrative access to create, manage, and delete users
- **Org User**: Limited access to standard features

### 2. **Authentication**
- Separate login system for organization users
- JWT-based authentication with refresh tokens
- Protected routes with role-based access control

### 3. **User Management (Admin Only)**
- Create new organization users
- View all users in the organization
- Delete users
- Assign user types (admin/user)

## File Structure

```
src/
├── OrgUser/
│   ├── Auth/
│   │   └── Login.tsx                    # Organization user login page
│   ├── Layouts/
│   │   └── Layouts.tsx                  # Main layout with role-based navigation
│   ├── Pages/
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx            # Dashboard with stats and activity
│   │   └── users/
│   │       └── UserManagement.tsx       # User management page (admin only)
│   └── components/
│       └── users/
│           ├── types.ts                 # TypeScript types
│           └── CreateUserDialog.tsx     # Create user dialog component
├── redux/
│   └── features/
│       └── orgAuth/
│           └── orgAuthSlice.ts          # Redux slice for org authentication
├── utils/
│   └── orgUserApi.tsx                   # API utilities for org user endpoints
└── components/
    └── other/
        └── ProtectedOrgRoutes.tsx       # Protected route wrapper
```

## API Endpoints

### Authentication
- **POST** `/api/v1/orgUser/login` - Login organization user
  ```typescript
  Body: {
    email: string,
    password: string
  }
  ```

### User Management
- **POST** `/api/v1/orgUser/create` - Create new user (admin only)
  ```typescript
  Body: {
    org_id: string,
    name: string,
    email: string,
    password: string,
    tel?: string,
    address?: string,
    picture?: string,
    type: 'org_admin' | 'org_user',
    app_access?: string,
    designation?: number,
    station_id?: number
  }
  ```

- **GET** `/api/v1/orgUser/` - Get all organization users
- **GET** `/api/v1/orgUser/:org_user_id` - Get single user
- **PUT** `/api/v1/orgUser/:org_user_id` - Update user
- **DELETE** `/api/v1/orgUser/:org_user_id` - Delete user

## Routes

### Public Routes
- `/org/login` - Organization user login page

### Protected Routes
All routes under `/org/*` require authentication:

- `/org/dashboard` - Main dashboard (all users)
- `/org/users` - User management (admin only)
- `/org/organization` - Organization info (all users)
- `/org/reports` - Reports page (all users)
- `/org/profile` - User profile (all users)

## Redux State

### OrgAuth State
```typescript
{
  user: {
    id: string,
    name: string,
    email: string,
    org_id: string,
    type: 'org_admin' | 'org_user',
    is_org_admin: boolean,
    tel?: string,
    address?: string,
    picture?: string,
    designation?: number,
    station_id?: number,
    app_access?: string
  } | null,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

## Usage

### 1. Organization User Login
```typescript
// Navigate to /org/login
// Enter credentials
// On success, redirects to /org/dashboard
```

### 2. Creating a New User (Admin Only)
```typescript
// Navigate to /org/users
// Click "Add User" button
// Fill in the form
// Submit to create the user
```

### 3. Checking User Role
```typescript
import { useAppSelector } from "@/redux/hooks";

const { user } = useAppSelector((state) => state.orgAuth);
const isOrgAdmin = user?.is_org_admin || user?.type === 'org_admin';

if (isOrgAdmin) {
  // Show admin features
}
```

### 4. Protected Routes
```typescript
// Protect a route for all authenticated org users
<Route element={<ProtectedOrgRoute><OrgUserLayout /></ProtectedOrgRoute>}>
  <Route path="/org/dashboard" element={<OrgUserDashboard />} />
</Route>

// Protect a route for admins only
<Route 
  path="/org/users" 
  element={
    <ProtectedOrgRoute requireAdmin>
      <UserManagement />
    </ProtectedOrgRoute>
  } 
/>
```

## Security Features

1. **JWT Authentication**: Access tokens stored in Redux state, refresh tokens in localStorage
2. **Role-Based Access Control**: Admin-only routes and features
3. **Protected Routes**: Automatic redirect to login if not authenticated
4. **Token Interceptors**: Automatic token attachment and 401 handling

## Storage

### localStorage Keys
- `orgToken` - JWT access token
- `orgUser` - User object (JSON)
- `orgRefreshToken` - Refresh token

## Styling

- Uses Tailwind CSS for styling
- Dark mode support via Redux settings
- Responsive design for mobile, tablet, and desktop
- Framer Motion animations for smooth transitions

## Components

### Key Components
1. **OrgUserLogin**: Login form with validation
2. **OrgUserLayout**: Main layout with sidebar navigation
3. **OrgUserDashboard**: Dashboard with stats and activity
4. **UserManagement**: Admin panel for user CRUD operations
5. **CreateUserDialog**: Modal form for creating users
6. **ProtectedOrgRoute**: HOC for route protection

## Integration with Admin System

The organization user system runs independently from the admin system:
- Separate authentication state (`orgAuth` vs `auth`)
- Separate API utilities (`orgUserApi.tsx` vs `api.tsx`)
- Separate route prefix (`/org/*` vs `/admin/*`)
- Separate local storage keys

## Future Enhancements

- [ ] User profile editing
- [ ] Password reset functionality
- [ ] Email verification
- [ ] User activity logs
- [ ] Advanced permissions system
- [ ] Bulk user operations
- [ ] User import/export
- [ ] Organization settings page
- [ ] Real-time notifications

## Development

### Adding New Org User Pages
1. Create component in `src/OrgUser/Pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/OrgUser/Layouts/Layouts.tsx`
4. Optionally protect with `ProtectedOrgRoute`

### API Integration
All API calls go through `orgUserApi.tsx` which handles:
- Base URL configuration
- Token management
- Error handling
- Response interceptors
