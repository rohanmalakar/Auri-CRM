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
      org_name_en: "Organization Name (English)",
      org_name_ar: "Organization Name (Arabic)",
      name_en: "Name (English)",
      name_ar: "Name (Arabic)",
      email: "Email",
      phone: "Phone Number",
      tel: "Telephone",
      mobile: "Mobile",
      vat_no: "VAT Number",
      type: "Type",
      country: "Country",
      state: "State",
      city: "City",
      pin: "PIN Code",
      contact_person: "Contact Person",
      contact_mobile: "Contact Mobile",
      contact_email: "Contact Email",
      currency: "Currency",
      timezone: "Timezone",
      status: "Status",
      logo: "Logo",
      basic_info: "Basic Information",
      location: "Location Details",
      creation_date: "Creation Date"
    },
    actions: {
      submit: "Create Organization",
      update: "Update Organization",
      cancel: "Cancel",
      delete: "Delete",
      view: "View",
      edit: "Edit",
      search: "Search organizations...",
      addUser: "Add User",
      back: "Back"
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
      org_name_en: "اسم المنظمة (إنجليزي)",
      org_name_ar: "اسم المنظمة (عربي)",
      name_en: "الاسم (إنجليزي)",
      name_ar: "الاسم (عربي)",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      tel: "الهاتف",
      mobile: "الجوال",
      vat_no: "الرقم الضريبي",
      type: "النوع",
      country: "الدولة",
      state: "المنطقة / المحافظة",
      city: "المدينة",
      pin: "الرمز البريدي",
      contact_person: "الشخص المسؤول",
      contact_mobile: "جوال المسؤول",
      contact_email: "بريد المسؤول",
      currency: "العملة",
      timezone: "المنطقة الزمنية",
      status: "الحالة",
      logo: "الشعار",
      basic_info: "المعلومات الأساسية",
      location: "تفاصيل الموقع",
      creation_date: "تاريخ الإنشاء"
    },
    actions: {
      submit: "إنشاء المنظمة",
      update: "تحديث المنظمة",
      cancel: "إلغاء",
      delete: "حذف",
      view: "عرض",
      edit: "تعديل",
      search: "بحث عن منظمة...",
      addUser: "إضافة مستخدم",
      back: "رجوع"
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