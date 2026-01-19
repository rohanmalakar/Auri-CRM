// Organization Form Data Types
export interface FormData {
  org_name_en: string;
  org_name_ar: string;
  email: string;
  vat_no?: string;
  tel?: string;
  country?: string;
  state?: string;
  city?: string;
  pin?: string;
  contact_person?: string;
  c_mobile?: string;
  c_email?: string;
  type?: string;
  currency: string;
  timezone: string;
  status: string;
}

// Organization Props
export interface OrgFormProps {
  initialData?: Partial<FormData> & { picture?: string };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Input Component Props
export interface InputWithErrorProps {
  name: keyof FormData;
  label: string;
  type?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  dir?: string;
  placeholder?: string;
}

// Translation Titles
export interface TranslationTitles {
  list: string;
  add: string;
  edit: string;
  view: string;
  users: string;
}

// Translation Placeholders
export interface TranslationPlaceholders {
  select: string;
}

// Translation Fields
export interface TranslationFields {
  basic_info: string;
  location: string;
  creation_date: string;
  vat_no: string;
  mobile: string;
  tel: string;
  org_name_en: string;
  org_name_ar: string;
  name_en: string;
  name_ar: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  pin: string;
  contact_person: string;
  contact_mobile: string;
  contact_email: string;
  type: string;
  currency: string;
  timezone: string;
  status: string;
  logo: string;
}

// Translation Actions
export interface TranslationActions {
  submit: string;
  update: string;
  cancel: string;
  delete: string;
  view: string;
  edit: string;
  search: string;
  addUser: string;
  back: string;
}

// Translation Validation
export interface TranslationValidation {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
}

// Translation Structure
export interface Translation {
  titles: TranslationTitles;
  fields: TranslationFields;
  actions: TranslationActions;
  placeholders: TranslationPlaceholders;
  validation: TranslationValidation;
}

// Translations Object
export interface Translations {
  en: Translation;
  ar: Translation;
}

// Organization Data (from API)
export interface Organization {
  org_id: string;
  org_name_en: string;
  org_name_ar: string;
  email: string;
  vat_no?: number;
  tel?: string;
  country?: string;
  state?: string;
  city?: string;
  pin?: string;
  contact_person?: string;
  c_mobile?: string;
  c_email?: string;
  password?: string;
  picture?: string;
  type?: string;
  currency: string;
  timezone: string;
  status: 'Active' | 'Inactive';
  creation_datetime: Date | string;
}

// API Response Types
export interface OrganizationApiResponse {
  success: boolean;
  data: {
    organizations: Organization[];
  };
}

// Organization User
export interface OrganizationUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
}
