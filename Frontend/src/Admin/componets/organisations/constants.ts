import type { Translations } from "./types";

export const TRANSLATIONS: Translations = {
  en: {
    titles: {
      list: "Organizations",
      add: "Add New Organization",
      edit: "Edit Organization",
      view: "Organization Details",
      users: "Organization Users",
    },
    fields: {
      name_en: "Organization Name (English)",
      name_ar: "Organization Name (Arabic)",
      email: "Email",
      phone: "Phone Number",
      type: "Type",
      country: "Country",
      state: "State",
      city: "City",
      pin: "PIN Code",
      contact_person: "Contact Person",
      contact_mobile: "Contact Mobile",
      contact_email: "Contact Email",
      status: "Status",
      logo: "Logo"
    },
    actions: {
      submit: "Create Organization",
      update: "Update Organization",
      cancel: "Cancel",
      delete: "Delete",
      view: "View",
      edit: "Edit",
      search: "Search organizations...",
      addUser: "Add User"
    },
    placeholders: {
      select: "Select...",
    },
    validation: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number"
    }
  },
  ar: {
    titles: {
      list: "المنظمات",
      add: "إضافة منظمة جديدة",
      edit: "تعديل المنظمة",
      view: "تفاصيل المنظمة",
      users: "مستخدمي المنظمة",
    },
    fields: {
      name_en: "اسم المنظمة (إنجليزي)",
      name_ar: "اسم المنظمة (عربي)",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      type: "النوع",
      country: "الدولة",
      state: "المنطقة / المحافظة",
      city: "المدينة",
      pin: "الرمز البريدي",
      contact_person: "الشخص المسؤول",
      contact_mobile: "جوال المسؤول",
      contact_email: "بريد المسؤول",
      status: "الحالة",
      logo: "الشعار"
    },
    actions: {
      submit: "إنشاء المنظمة",
      update: "تحديث المنظمة",
      cancel: "إلغاء",
      delete: "حذف",
      view: "عرض",
      edit: "تعديل",
      search: "بحث عن منظمة...",
      addUser: "إضافة مستخدم"
    },
    placeholders: {
      select: "اختر...",
    },
    validation: {
      required: "هذا الحقل مطلوب",
      invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صالح",
      invalidPhone: "يرجى إدخال رقم هاتف صالح"
    }
  }
};