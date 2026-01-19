// User Management Translation Types
export interface UserTranslationTitles {
  management: string;
  createUser: string;
  deleteUser: string;
  userDetails: string;
}

export interface UserTranslationFields {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  picture: string;
  designation: string;
  branch: string;
  status: string;
  actions: string;
  logo: string;
}

export interface UserTranslationDesignations {
  cashier: string;
  manager: string;
  admin: string;
  other: string;
}

export interface UserTranslationActions {
  addUser: string;
  create: string;
  cancel: string;
  delete: string;
  edit: string;
  search: string;
}

export interface UserTranslationMessages {
  createSuccess: string;
  deleteSuccess: string;
  createError: string;
  deleteError: string;
  deleteConfirmation: string;
  deleteWarning: string;
  accessRestricted: string;
  noPermission: string;
  cashierRestriction: string;
  createDescription: string;
  noUsers: string;
  noMatchingUsers: string;
  creating: string;
  deleting: string;
  loadingBranches: string;
  active: string;
  inactive: string;
}

export interface UserTranslationStats {
  totalUsers: string;
  activeUsers: string;
  totalSpending: string;
  totalPoints: string;
}

export interface UserTranslationValidation {
  required: string;
  invalidEmail: string;
  minPassword: string;
}

export interface UserTranslationPlaceholders {
  selectDesignation: string;
  selectBranch: string;
  searchUsers: string;
  pictureUrl: string;
}

export interface UserTranslation {
  titles: UserTranslationTitles;
  fields: UserTranslationFields;
  designations: UserTranslationDesignations;
  actions: UserTranslationActions;
  messages: UserTranslationMessages;
  stats: UserTranslationStats;
  validation: UserTranslationValidation;
  placeholders: UserTranslationPlaceholders;
}

export interface UserTranslations {
  en: UserTranslation;
  ar: UserTranslation;
}
