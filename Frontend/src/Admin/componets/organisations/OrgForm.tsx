import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Building2, MapPin, User, Phone, Mail, Globe, AlertCircle } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "./constants";
import type { FormData, OrgFormProps, InputWithErrorProps } from "./types";

export default function OrgForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting
}: OrgFormProps) {
  const { language } = useAppSelector((state) => state.settings);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [formData, setFormData] = useState<FormData>({
    name_en: "",
    name_ar: "",
    email: "",
    tel: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    contact_person: "",
    c_mobile: "",
    c_email: "",
    type: "",
    status: "active",
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 7 && re.test(phone);
  };

  const validateField = (name: string, value: string): string => {
    const requiredFields = ['name_en', 'name_ar', 'email', 'tel', 'country', 'city', 'contact_person', 'c_mobile', 'c_email'];
    
    if (requiredFields.includes(name) && !value.trim()) {
      return t.validation.required;
    }

    if ((name === 'email' || name === 'c_email') && value && !validateEmail(value)) {
      return t.validation.invalidEmail;
    }

    if ((name === 'tel' || name === 'c_mobile') && value && !validatePhone(value)) {
      return t.validation.invalidPhone;
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.type.startsWith('image/')) {
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key] = error;
      }
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.keys(newErrors).some(key => newErrors[key])) {
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key as keyof FormData]));
    if (file) data.append("picture", file);
    await onSubmit(data as any);
  };

  const InputWithError = ({ name, label, type = "text", required = false, icon: Icon, dir, placeholder }: InputWithErrorProps) => (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500`} />
        )}
        <Input 
          id={name}
          name={name} 
          type={type}
          value={formData[name]} 
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          dir={dir}
          placeholder={placeholder}
          className={`
            ${Icon ? (isRtl ? 'pr-9' : 'pl-9') : ''}
            bg-white dark:bg-zinc-900 
            border-gray-300 dark:border-zinc-700
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-600
            focus:border-transparent
            transition-all duration-200
            ${touched[name] && errors[name] ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}
          `}
        />
      </div>
      {touched[name] && errors[name] && (
        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{errors[name]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 p-2 lg:min-w-5xl lg:max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 mb-6 border-b border-gray-200 dark:border-zinc-700">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialData ? t.actions.edit : t.actions.submit}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isRtl ? 'إدارة تفاصيل وإعدادات المنظمة' : 'Manage organization details and settings'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
           <Label htmlFor="status-switch" className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200">
             {t.fields.status}
           </Label>
           <Switch 
             id="status-switch"
             checked={formData.status === 'active'}
             onCheckedChange={(checked) => setFormData({...formData, status: checked ? 'active' : 'inactive'})}
           />
           <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
             formData.status === 'active' 
               ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
               : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
           }`}>
             {formData.status}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity Card */}
        <div className="lg:col-span-1">
          <Card className="h-full border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Building2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-gray-900 dark:text-white">
                  {isRtl ? 'الهوية' : 'Identity'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {/* Logo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-36 h-36 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden transition-all duration-300 group-hover:border-pink-500 dark:group-hover:border-pink-400 group-hover:shadow-lg">
                    {preview ? (
                      <img src={preview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-2 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.fields.logo}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      aria-label="Upload logo"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  {isRtl ? 'PNG، JPG أو GIF (حد أقصى 5 ميجابايت)' : 'PNG, JPG or GIF (max 5MB)'}
                </p>
              </div>

              {/* Organization Names */}
              <div className="space-y-4">
                <InputWithError 
                  name="name_en"
                  label={t.fields.name_en}
                  required={true}
                  placeholder="e.g. Tech Corp"
                />
                <InputWithError 
                  name="name_ar"
                  label={t.fields.name_ar}
                  required={true}
                  dir="rtl"
                  placeholder="مثال: شركة التقنية"
                />
                <InputWithError 
                  name="type"
                  label={t.fields.type}
                  placeholder={isRtl ? "مثال: تجزئة" : "e.g. Retail"}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Contact Information Card */}
          <Card className="border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-200">
             <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                   <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <span className="text-gray-900 dark:text-white">
                   {isRtl ? 'معلومات الاتصال' : 'Contact Information'}
                 </span>
               </CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <InputWithError 
                  name="email"
                  label={t.fields.email}
                  type="email"
                  required={true}
                  icon={Mail}
                  placeholder={isRtl ? "مثال@شركة.com" : "email@company.com"}
                />
                <InputWithError 
                  name="tel"
                  label={t.fields.phone}
                  required={true}
                  icon={Phone}
                  placeholder="+1 234 567 8900"
                />
             </CardContent>
          </Card>

          {/* Location Details Card */}
          <Card className="border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-200">
             <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                   <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                 </div>
                 <span className="text-gray-900 dark:text-white">
                   {isRtl ? 'تفاصيل الموقع' : 'Location Details'}
                 </span>
               </CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
               <InputWithError 
                 name="country"
                 label={t.fields.country}
                 required={true}
                 icon={Globe}
                 placeholder={isRtl ? "مثال: السعودية" : "e.g. United States"}
               />
               <InputWithError 
                 name="city"
                 label={t.fields.city}
                 required={true}
                 placeholder={isRtl ? "مثال: الرياض" : "e.g. New York"}
               />
               <InputWithError 
                 name="state"
                 label={t.fields.state}
                 placeholder={isRtl ? "مثال: الشرقية" : "e.g. California"}
               />
               <InputWithError 
                 name="pin"
                 label={t.fields.pin}
                 placeholder={isRtl ? "مثال: 12345" : "e.g. 10001"}
               />
             </CardContent>
          </Card>

          {/* Primary Contact Person Card */}
          <Card className="border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-200">
             <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                   <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                 </div>
                 <span className="text-gray-900 dark:text-white">
                   {isRtl ? 'شخص الاتصال الرئيسي' : 'Primary Contact Person'}
                 </span>
               </CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
               <div className="md:col-span-2">
                 <InputWithError 
                   name="contact_person"
                   label={t.fields.contact_person}
                   required={true}
                   icon={User}
                   placeholder={isRtl ? "مثال: أحمد محمد" : "e.g. John Smith"}
                 />
               </div>
               <InputWithError 
                 name="c_mobile"
                 label={t.fields.contact_mobile}
                 required={true}
                 icon={Phone}
                 placeholder="+1 234 567 8900"
               />
               <InputWithError 
                 name="c_email"
                 label={t.fields.contact_email}
                 type="email"
                 required={true}
                 icon={Mail}
                 placeholder={isRtl ? "شخص@شركة.com" : "person@company.com"}
               />
             </CardContent>
          </Card>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-zinc-700">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
        >
          {t.actions.cancel}
        </Button>
        <Button 
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting} 
          className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white min-w-[150px] shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? t.actions.update : t.actions.submit}
        </Button>
      </div>
    </div>
  );
}