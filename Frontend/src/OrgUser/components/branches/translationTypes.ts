// Branch Management Translation Types
export interface BranchTranslationTitles {
  list: string;
  add: string;
  edit: string;
  delete: string;
  management: string;
}

export interface BranchTranslationFields {
  name_en: string;
  name_ar: string;
  branch_phone_number: string;
  phone: string;
  city: string;
  address: string;
  location_link: string;
  status: string;
  branch_name: string;
  name: string;
  actions: string;
  active: string;
  inactive: string;
}

export interface BranchTranslationActions {
  create: string;
  update: string;
  cancel: string;
  delete: string;
  edit: string;
  search: string;
  addBranch: string;
  confirmDelete: string;
}

export interface BranchTranslationMessages {
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  createError: string;
  updateError: string;
  deleteError: string;
  deleteConfirmation: string;
  accessRestricted: string;
  noPermission: string;
  cashierRestriction: string;
  subtitle: string;
  formDescription: string;
  editDescription: string;
  deleteWarning: string;
  activeStatus: string;
  inactiveStatus: string;
  active: string;
  inactive: string;
  editTooltip: string;
  deleteTooltip: string;
  creating: string;
  updating: string;
}

export interface BranchTranslationValidation {
  required: string;
  invalidPhone: string;
}

export interface BranchTranslationPlaceholders {
  name_en: string;
  name_ar: string;
  phone: string;
  city: string;
  address: string;
  location_link: string;
  search: string;
}

export interface BranchTranslation {
  titles: BranchTranslationTitles;
  fields: BranchTranslationFields;
  actions: BranchTranslationActions;
  messages: BranchTranslationMessages;
  validation: BranchTranslationValidation;
  placeholders: BranchTranslationPlaceholders;
}

export interface BranchTranslations {
  en: BranchTranslation;
  ar: BranchTranslation;
}
