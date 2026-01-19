# Branch Management - Arabic Language Support

## Overview
Complete translation system for Branch Management module supporting English and Arabic languages with full RTL (Right-to-Left) layout support.

## Files Updated

### 1. Translation Configuration
- **`src/OrgUser/components/branches/translationTypes.ts`**
  - TypeScript interfaces for type-safe translations
  - Defines structure for titles, fields, actions, messages, validation, and placeholders

- **`src/OrgUser/components/branches/constants.ts`**
  - Complete English and Arabic translations
  - Accessible via `BRANCH_TRANSLATIONS[language]`

### 2. Components Updated

#### BranchForm.tsx
- ✅ All labels translated (name_en, name_ar, phone, city, address, location_link, status)
- ✅ All placeholders translated
- ✅ All button text translated (Create, Update, Cancel)
- ✅ All validation messages translated
- ✅ Dialog titles and descriptions translated
- ✅ RTL support added:
  - Icon positioning: `${isRtl ? 'right-3' : 'left-3'}`
  - Input padding: `${isRtl ? 'pr-9' : 'pl-9'}`
  - Spinner positioning: `${isRtl ? 'ml-2' : 'mr-2'}`
  - Text direction: `dir={isRtl ? 'rtl' : 'ltr'}`

#### BranchManagement.tsx
- ✅ Page title and subtitle translated
- ✅ Table column headers translated
- ✅ Status badges translated (Active/Inactive)
- ✅ Search placeholder translated
- ✅ Action buttons translated
- ✅ Tooltips translated
- ✅ Delete confirmation dialog translated
- ✅ Access restriction messages translated
- ✅ Error messages translated
- ✅ RTL support added to main container and dialogs

## Translation Structure

```typescript
BRANCH_TRANSLATIONS = {
  en: {
    titles: { list, add, edit, delete, management },
    fields: { name_en, name_ar, phone, city, address, location_link, status, name, actions },
    actions: { create, update, cancel, delete, edit, search, addBranch, confirmDelete },
    messages: { 
      createSuccess, updateSuccess, deleteSuccess,
      createError, updateError, deleteError,
      deleteConfirmation, deleteWarning,
      accessRestricted, noPermission, cashierRestriction,
      subtitle, formDescription, editDescription,
      activeStatus, inactiveStatus, active, inactive,
      editTooltip, deleteTooltip, creating, updating
    },
    validation: { required, invalidPhone },
    placeholders: { name_en, name_ar, phone, city, address, location_link, search }
  },
  ar: { /* Same structure with Arabic translations */ }
}
```

## Usage Pattern

### In Components
```tsx
import { useAppSelector } from "@/redux/hooks";
import { BRANCH_TRANSLATIONS } from "./constants";

const { language } = useAppSelector((state) => state.settings);
const t = BRANCH_TRANSLATIONS[language];
const isRtl = language === 'ar';

// Use translations
<Label>{t.fields.name_en}</Label>
<Input placeholder={t.placeholders.phone} />
<Button>{t.actions.create}</Button>

// RTL support
<div dir={isRtl ? 'rtl' : 'ltr'}>
  <Icon className={`${isRtl ? 'mr-2' : 'ml-2'}`} />
</div>
```

## Features

### 1. Bilingual Support
- All UI text available in English and Arabic
- Seamless language switching via Redux settings
- No hardcoded strings

### 2. RTL Layout
- Proper text direction (dir attribute)
- Icon positioning adjusts for RTL
- Spacing (margin/padding) flips for RTL
- Form layouts maintain proper alignment

### 3. Type Safety
- TypeScript interfaces ensure all translations present
- Compile-time checks for missing translations
- Autocomplete support in IDE

### 4. Consistent Pattern
- Same translation structure across all modules
- Easy to add new translation keys
- Centralized translation management

## Testing Checklist

✅ Switch language in settings
✅ All text displays correctly in both languages
✅ Forms validate with localized messages
✅ RTL layout works properly in Arabic
✅ Icons and spacing adjust for RTL
✅ Table columns show correct headers
✅ Modal dialogs display properly in both languages
✅ Success/error messages show in correct language
✅ Tooltips work in both languages

## Adding New Translations

1. **Add to translationTypes.ts**
   ```typescript
   export interface BranchTranslationFields {
     // ... existing fields
     newField: string;
   }
   ```

2. **Add to constants.ts**
   ```typescript
   export const BRANCH_TRANSLATIONS = {
     en: {
       fields: {
         // ... existing fields
         newField: "New Field",
       }
     },
     ar: {
       fields: {
         // ... existing fields
         newField: "حقل جديد",
       }
     }
   }
   ```

3. **Use in component**
   ```tsx
   <Label>{t.fields.newField}</Label>
   ```

## Role-Based Access Control
- Translations support role-based messages
- Admin/Manager: Full access
- Cashier: Access restricted with localized message
- Other: Access restricted with localized message

## Best Practices
1. Always use `t.section.key` pattern
2. Add `dir={isRtl ? 'rtl' : 'ltr'}` to containers
3. Use conditional positioning for icons/spacing
4. Test both languages after changes
5. Keep translations synchronized between en/ar
6. Use meaningful keys that describe the content
7. Group related translations in same section

## Dependencies
- Redux store: `state.settings.language`
- React hooks: `useAppSelector`
- Translation constants: `BRANCH_TRANSLATIONS`
- Type definitions: `translationTypes.ts`
