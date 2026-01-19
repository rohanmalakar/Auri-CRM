# Branch Management System

A complete branch management system for the OrgUser section with full CRUD operations using TanStack Query.

## Features

✅ **Create Branch** - Add new branches with bilingual support (English & Arabic)
✅ **View Branches** - List all branches in a sortable, searchable table
✅ **Update Branch** - Edit branch information including status toggle
✅ **Delete Branch** - Soft delete branches with confirmation dialog
✅ **Role-Based Access** - Only Admin and Manager can manage branches
✅ **Search & Filter** - Search branches by name (EN/AR) or city
✅ **Responsive Design** - Works on mobile, tablet, and desktop

## Files Created

### 1. Types
- `src/OrgUser/components/branches/types.ts` - TypeScript interfaces for Branch entities

### 2. Components
- `src/OrgUser/components/branches/BranchForm.tsx` - Reusable form for Create/Edit operations

### 3. Pages
- `src/OrgUser/Pages/branches/BranchManagement.tsx` - Main page with table and all CRUD operations

### 4. API Service
- Updated `src/utils/orgUserApi.tsx` with `branchApiService` containing all API endpoints

### 5. Routing
- Updated `src/App.tsx` to add `/org/branches` route (protected, admin-only)
- Updated `src/OrgUser/Layouts/Layouts.tsx` to add Branches menu item

## API Endpoints Used

All endpoints use `/api/v1/branch` base URL:

- `POST /api/v1/branch/:org_id` - Create branch
- `GET /api/v1/branch/:org_id` - Get all branches
- `GET /api/v1/branch/:org_id/active` - Get active branches
- `GET /api/v1/branch/detail/:branch_id` - Get branch by ID
- `PUT /api/v1/branch/:branch_id` - Update branch
- `DELETE /api/v1/branch/:branch_id` - Delete branch (soft delete)

## Branch Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name_en | string | Yes | Branch name in English |
| name_ar | string | Yes | Branch name in Arabic |
| branch_phone_number | string | Yes | Contact phone number |
| city | string | Yes | City location |
| address | string | Yes | Full address |
| location_link | string | No | Google Maps URL |
| status | enum | No | Active, Inactive, or Deleted |

## Access Control

### Permissions by Role:
- **Admin** ✅ Full access (Create, Read, Update, Delete)
- **Manager** ✅ Full access (Create, Read, Update, Delete)
- **Cashier** ❌ No access (restricted)
- **Other** ❌ No access (restricted)

### Implementation:
```typescript
const isAdminOrManager = user?.designation === 'Admin' || user?.designation === 'Manager';
```

## Usage

### Navigate to Branch Management
1. Log in as Admin or Manager
2. Click "Branches" in the sidebar navigation
3. You'll see the branch management page with a table

### Create a Branch
1. Click "Add Branch" button
2. Fill in the form (all fields marked with * are required)
3. Click "Create Branch"

### Edit a Branch
1. Click the pencil icon on any branch row
2. Modify the fields in the modal
3. Toggle status between Active/Inactive if needed
4. Click "Update Branch"

### Delete a Branch
1. Click the trash icon on any branch row
2. Confirm deletion in the dialog
3. Branch will be soft-deleted (status set to 'Deleted')

### Search Branches
- Use the search box to filter by:
  - Branch name (English)
  - Branch name (Arabic)
  - City name

## TanStack Query Integration

### Query Keys:
```typescript
['branches', user?.org_id] // For fetching branches list
```

### Mutations:
- `createMutation` - Creates new branch
- `updateMutation` - Updates existing branch
- `deleteMutation` - Soft deletes branch

All mutations automatically invalidate and refetch the branches list on success.

## Form Validation

### Required Fields:
- Branch Name (English)
- Branch Name (Arabic)
- Phone Number
- City
- Address

### Phone Number Validation:
- Must contain only digits, spaces, +, -, (, )
- Minimum length: 7 characters

## Styling

- Uses Tailwind CSS for styling
- Supports dark mode
- Responsive design with mobile-first approach
- DataTable with custom styles for light/dark themes

## Error Handling

- API errors are caught and displayed via alert
- Form validation prevents invalid submissions
- Loading states during API calls
- Disabled buttons during mutations

## Future Enhancements

- Branch details view page
- Assign users to branches
- Branch statistics dashboard
- Export branches to CSV/Excel
- Bulk operations (activate/deactivate multiple branches)
- Branch location on map integration
