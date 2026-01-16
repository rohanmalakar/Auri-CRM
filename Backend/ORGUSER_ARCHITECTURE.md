# OrgUser API Architecture

This document describes the complete TypeScript architecture for the OrgUser module using Sequelize ORM.

## Architecture Overview

The OrgUser module follows a layered architecture pattern similar to the User module:

```
Controller → Service → Repository → Model (Sequelize ORM)
```

## Files Created

### 1. Model Layer
**File:** `src/models/orgUser.ts`
- Sequelize TypeScript model with decorators
- Password hashing hooks (beforeCreate, beforeUpdate)
- Instance method for password verification
- Safe object method to exclude password from responses

### 2. Repository Layer
**File:** `src/repository/orgUser.ts`
- Database operations with Sequelize
- Transaction support
- Methods include:
  - `checkIfOrgUserExists()` - Validate uniqueness
  - `createOrgUser()` - Create new org user
  - `getOrgUserById()` - Get by primary key
  - `getOrgUserByEmail()` - Get by email
  - `getAllOrgUsers()` - Get all users
  - `getOrgUsersByOrgId()` - Filter by organization
  - `getOrgUsersByBranchId()` - Filter by branch
  - `updateOrgUser()` - Update user data
  - `deleteOrgUser()` - Soft delete (set status to Inactive)
  - `getActiveOrgUsersByOrgId()` - Get active users by org

### 3. Service Layer
**File:** `src/service/orgUser.ts`
- Business logic layer
- Transaction management
- JWT token generation
- Methods include:
  - `createOrgUser()` - Create with validation
  - `loginOrgUser()` - Authentication with JWT
  - `getOrgUserById()` - Retrieve user
  - `getAllOrgUsers()` - List all users
  - `getOrgUsersByOrgId()` - Filter by organization
  - `getOrgUsersByBranchId()` - Filter by branch
  - `updateOrgUser()` - Update user data
  - `deleteOrgUser()` - Soft delete with transaction
  - `changePassword()` - Password change with validation
  - `getActiveOrgUsersByOrgId()` - Get active users

### 4. Controller Layer
**File:** `src/controller/orgUser.ts`
- Express routes with validation
- Zod schemas for request validation
- Routes:
  - `POST /orgUser/create` - Create new org user
  - `POST /orgUser/login` - Login with email/password
  - `GET /orgUser/:org_user_id` - Get user by ID
  - `GET /orgUser/` - Get all users
  - `POST /orgUser/by-org` - Get users by org ID
  - `POST /orgUser/by-branch` - Get users by branch ID
  - `PUT /orgUser/:org_user_id` - Update user
  - `DELETE /orgUser/:org_user_id` - Soft delete user
  - `POST /orgUser/:org_user_id/change-password` - Change password
  - `POST /orgUser/active/by-org` - Get active users by org

### 5. Utility Files
**File:** `src/utils/sequelize.ts`
- Sequelize instance configuration
- Connection pooling
- Model registration

**File:** `src/customTypes/connection.ts`
- Custom Request interface extending Express Request
- User authentication context

## Configuration Updates

### tsconfig.json
Added path aliases:
- `@service/*` - Maps to `service/*`
- `@services/*` - Maps to `service/*` (for compatibility)

### package.json
Added scripts:
```json
"build": "tsc"
"dev": "nodemon --exec ts-node -r tsconfig-paths/register src/app.ts"
"start": "node dist/app.js"
"watch": "tsc --watch"
```

### app.ts
- Imported Sequelize instance
- Added model sync on startup
- Registered `/orgUser` routes

### error.ts
Added error codes:
- `INVALID_CREDENTIALS` - For login failures
- `USER_INACTIVE` - For inactive users

### jwt.ts
Updated `TokenData` interface to support:
- String or number IDs
- Optional `org_id` and `type` fields

## Database Schema

The OrgUser model maps to the `org_users` table with the following structure:

```typescript
{
  org_user_id: string (PK)
  org_id: string
  branch_id?: number
  name: string
  email: string (unique)
  password: string (auto-hashed)
  tel?: string
  address?: string
  picture?: string
  status: 'Active' | 'Inactive'
  type: string
  app_access?: string
  designation?: number
  station_id?: number
  creation_datetime: Date
}
```

## Dependencies Installed

```bash
npm install sequelize sequelize-typescript bcrypt @types/bcrypt validator @types/validator reflect-metadata
```

## Usage Examples

### Create Org User
```typescript
POST /orgUser/create
{
  "org_id": "ORG123",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "type": "admin",
  "branch_id": 1
}
```

### Login
```typescript
POST /orgUser/login
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Get Users by Organization
```typescript
POST /orgUser/by-org
{
  "org_id": "ORG123"
}
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Features

✅ TypeScript with strict type checking
✅ Sequelize ORM with TypeScript decorators
✅ Automatic password hashing using bcrypt
✅ JWT authentication
✅ Transaction support
✅ Request validation with Zod
✅ Layered architecture (Controller → Service → Repository → Model)
✅ Error handling with custom error codes
✅ Soft delete functionality
✅ Path aliases for clean imports

## Notes

- Passwords are automatically hashed before saving to database
- Soft delete is implemented (status set to 'Inactive' instead of removing records)
- All responses exclude password field using `toSafeObject()` method
- Transactions are used for data consistency in create, update, and delete operations
- The architecture follows the same pattern as the existing User module for consistency
