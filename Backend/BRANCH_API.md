# Branch API Documentation

Base URL: `/api/v1/branch`

All endpoints require authentication token in the Authorization header: `Bearer <token>`

---

## 1. Create Branch

**POST** `/api/v1/branch/:org_id`

Create a new branch for an organization.

### URL Parameters
- `org_id` (string, required) - Organization ID

### Request Body
```json
{
  "name_en": "Main Branch",
  "name_ar": "الفرع الرئيسي",
  "branch_phone_number": "+966501234567",
  "city": "Riyadh",
  "address": "King Fahd Road, Al Olaya District",
  "location_link": "https://maps.google.com/?q=24.7136,46.6753"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "branch": {
      "branch_id": "uuid-here",
      "org_id": "org-uuid",
      "name_en": "Main Branch",
      "name_ar": "الفرع الرئيسي",
      "branch_phone_number": "+966501234567",
      "city": "Riyadh",
      "address": "King Fahd Road, Al Olaya District",
      "location_link": "https://maps.google.com/?q=24.7136,46.6753",
      "status": "Active",
      "creation_datetime": "2026-01-19T12:00:00.000Z"
    }
  }
}
```

---

## 2. Get All Branches

**GET** `/api/v1/branch/:org_id`

Get all branches (Active and Inactive) for an organization.

### URL Parameters
- `org_id` (string, required) - Organization ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "branches": [
      {
        "branch_id": "uuid-here",
        "org_id": "org-uuid",
        "name_en": "Main Branch",
        "name_ar": "الفرع الرئيسي",
        "branch_phone_number": "+966501234567",
        "city": "Riyadh",
        "address": "King Fahd Road, Al Olaya District",
        "location_link": "https://maps.google.com/?q=24.7136,46.6753",
        "status": "Active",
        "creation_datetime": "2026-01-19T12:00:00.000Z"
      }
    ]
  }
}
```

---

## 3. Get Active Branches

**GET** `/api/v1/branch/:org_id/active`

Get only active branches for an organization.

### URL Parameters
- `org_id` (string, required) - Organization ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "branches": [
      {
        "branch_id": "uuid-here",
        "org_id": "org-uuid",
        "name_en": "Main Branch",
        "name_ar": "الفرع الرئيسي",
        "branch_phone_number": "+966501234567",
        "city": "Riyadh",
        "address": "King Fahd Road, Al Olaya District",
        "location_link": "https://maps.google.com/?q=24.7136,46.6753",
        "status": "Active",
        "creation_datetime": "2026-01-19T12:00:00.000Z"
      }
    ]
  }
}
```

---

## 4. Get Branch by ID

**GET** `/api/v1/branch/detail/:branch_id`

Get details of a specific branch.

### URL Parameters
- `branch_id` (string, required) - Branch ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "branch": {
      "branch_id": "uuid-here",
      "org_id": "org-uuid",
      "name_en": "Main Branch",
      "name_ar": "الفرع الرئيسي",
      "branch_phone_number": "+966501234567",
      "city": "Riyadh",
      "address": "King Fahd Road, Al Olaya District",
      "location_link": "https://maps.google.com/?q=24.7136,46.6753",
      "status": "Active",
      "creation_datetime": "2026-01-19T12:00:00.000Z"
    }
  }
}
```

---

## 5. Update Branch

**PUT** `/api/v1/branch/:branch_id`

Update branch information.

### URL Parameters
- `branch_id` (string, required) - Branch ID

### Request Body
All fields are optional. Only include fields you want to update.

```json
{
  "name_en": "Updated Branch Name",
  "name_ar": "اسم الفرع المحدث",
  "branch_phone_number": "+966509876543",
  "city": "Jeddah",
  "address": "New Address",
  "location_link": "https://maps.google.com/?q=21.5433,39.1728",
  "status": "Inactive"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "branch": {
      "branch_id": "uuid-here",
      "org_id": "org-uuid",
      "name_en": "Updated Branch Name",
      "name_ar": "اسم الفرع المحدث",
      "branch_phone_number": "+966509876543",
      "city": "Jeddah",
      "address": "New Address",
      "location_link": "https://maps.google.com/?q=21.5433,39.1728",
      "status": "Inactive",
      "creation_datetime": "2026-01-19T12:00:00.000Z"
    }
  }
}
```

---

## 6. Delete Branch

**DELETE** `/api/v1/branch/:branch_id`

Soft delete a branch (sets status to 'Deleted').

### URL Parameters
- `branch_id` (string, required) - Branch ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "Branch deleted successfully"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": 30101,
    "message": "Branch name (English) already exists in this organization"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": 10005,
    "message": "UNAUTHERISED"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": 30102,
    "message": "Branch not found"
  }
}
```

---

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name_en` | string | Yes | Branch name in English |
| `name_ar` | string | Yes | Branch name in Arabic |
| `branch_phone_number` | string | Yes | Branch contact phone number |
| `city` | string | Yes | City where branch is located |
| `address` | string | Yes | Full address of the branch |
| `location_link` | string | No | Google Maps or location URL |
| `status` | enum | No | Branch status: `Active`, `Inactive`, `Deleted` |

---

## Status Values

- **Active**: Branch is operational and can have users assigned
- **Inactive**: Branch is temporarily disabled
- **Deleted**: Branch is soft deleted (hidden from normal queries)

---

## Notes

1. Branch names (both English and Arabic) must be unique within an organization
2. Deleted branches are filtered out from normal queries
3. Only active branches can have users assigned to them
4. All endpoints require a valid authentication token
