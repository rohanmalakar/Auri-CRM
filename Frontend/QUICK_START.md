# Organization User System - Quick Start Guide

## 🚀 What's Been Created

A complete organization user management system with:
- ✅ Separate login for org users
- ✅ Role-based access (Org Admin & Org User)
- ✅ User management (CRUD operations)
- ✅ Protected routes
- ✅ Redux state management
- ✅ Dedicated layouts and pages

## 📁 New Files Created

```
src/
├── OrgUser/
│   ├── Auth/
│   │   └── Login.tsx                           # Org user login page
│   ├── Layouts/
│   │   └── Layouts.tsx                         # Main layout with sidebar
│   ├── Pages/
│   │   ├── dashboard/Dashboard.tsx             # Dashboard page
│   │   └── users/UserManagement.tsx            # User management (admin only)
│   └── components/
│       └── users/
│           ├── types.ts                        # TypeScript interfaces
│           └── CreateUserDialog.tsx            # Create user dialog
├── redux/features/orgAuth/
│   └── orgAuthSlice.ts                         # Redux slice for org auth
├── utils/
│   └── orgUserApi.tsx                          # API service layer
└── components/other/
    └── ProtectedOrgRoutes.tsx                  # Route protection HOC
```

## 🔑 Key Features

### 1. **Two User Types**
- **Org Admin**: Can create, view, and delete users
- **Org User**: Standard access without admin privileges

### 2. **Routes**
| Route | Access | Description |
|-------|--------|-------------|
| `/org/login` | Public | Login page |
| `/org/dashboard` | All users | Main dashboard |
| `/org/users` | Admin only | User management |
| `/org/organization` | All users | Org info (placeholder) |
| `/org/reports` | All users | Reports (placeholder) |
| `/org/profile` | All users | User profile (placeholder) |

### 3. **API Endpoints Required**

#### Login
```typescript
POST /api/v1/orgUser/login
Body: { email: string, password: string }
Response: { 
  data: {
    org_user_id, email, name, org_id, type,
    access_token, refresh_token, ...
  }
}
```

#### Create User (Admin Only)
```typescript
POST /api/v1/orgUser/create
Body: {
  org_id: string,
  name: string,
  email: string,
  password: string,
  type: 'org_admin' | 'org_user',
  tel?: string,
  address?: string,
  picture?: string,
  app_access?: string,
  designation?: number,
  station_id?: number
}
```

#### Get All Users
```typescript
GET /api/v1/orgUser/
Query: { org_id?: string }
Response: { data: OrgUser[] }
```

#### Delete User (Admin Only)
```typescript
DELETE /api/v1/orgUser/:org_user_id
```

## 🎨 UI Components Used

- Shadcn UI components (Button, Card, Dialog, Input, etc.)
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling
- Dark mode support

## 🔐 Security Features

- JWT token-based authentication
- Separate token storage (orgToken, orgUser)
- Role-based route protection
- Automatic token attachment via interceptors
- 401 redirect handling

## 📝 Usage Examples

### Check if User is Admin
```typescript
import { useAppSelector } from "@/redux/hooks";

const { user } = useAppSelector((state) => state.orgAuth);
const isOrgAdmin = user?.is_org_admin || user?.type === 'org_admin';
```

### Protect a Route
```typescript
<Route 
  path="/org/users" 
  element={
    <ProtectedOrgRoute requireAdmin>
      <UserManagement />
    </ProtectedOrgRoute>
  } 
/>
```

### API Call Example
```typescript
import { orgUserApiService } from "@/utils/orgUserApi";

// Get all users
const response = await orgUserApiService.getAllUsers(orgId);

// Create user
await orgUserApiService.createUser({
  org_id: "123",
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  type: "org_user"
});
```

## 🚦 Testing Steps

1. **Login as Org User**
   - Navigate to `/org/login`
   - Enter credentials
   - Should redirect to `/org/dashboard`

2. **View Dashboard**
   - See stats, activity, and performance metrics
   - Admin users see additional "Admin Quick Actions" section

3. **User Management (Admin Only)**
   - Navigate to `/org/users`
   - Click "Add User" to create new user
   - Fill form and submit
   - View user cards in grid layout
   - Delete users using dropdown menu

4. **Access Control**
   - Regular users cannot access `/org/users`
   - Trying to access protected routes redirects appropriately

## 🔧 Configuration

### Environment Variables
Ensure your `.env` file has:
```
VITE_BACKEND_URL=http://localhost:3000
```

### Redux Store
Already configured in `src/redux/store.ts` with `orgAuth` slice.

## 🎯 Next Steps

Potential enhancements:
- [ ] Implement organization info page
- [ ] Create reports functionality
- [ ] Add user profile editing
- [ ] Implement password reset
- [ ] Add email verification
- [ ] Create activity logs
- [ ] Add user permissions system

## 📚 Documentation

See `ORG_USER_SYSTEM.md` for comprehensive documentation including:
- Complete API reference
- Component descriptions
- Redux state structure
- Advanced usage patterns
- Security considerations

## 🐛 Known Issues

- Gradient CSS classes show warnings (bg-gradient-to-r vs bg-linear-to-r) - cosmetic only
- Need to implement actual organization info and reports pages

## 💡 Tips

- Use Chrome DevTools to inspect Redux state
- Check localStorage for orgToken and orgUser
- API errors are logged to console
- Protected routes automatically redirect on auth failure
