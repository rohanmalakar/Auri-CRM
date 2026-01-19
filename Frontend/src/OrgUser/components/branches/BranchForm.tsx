import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, AlertCircle, MapPin, Phone, Building2, Globe } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { BRANCH_TRANSLATIONS } from "./constants";
import type { Branch, BranchFormData } from "./types";

interface BranchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BranchFormData) => Promise<void>;
  initialData?: Branch | null;
  isSubmitting: boolean;
}

export default function BranchForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting,
}: BranchFormProps) {
  const { language } = useAppSelector((state) => state.settings);
  const t = BRANCH_TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [formData, setFormData] = useState<BranchFormData>({
    name_en: "",
    name_ar: "",
    branch_phone_number: "",
    city: "",
    address: "",
    location_link: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name_en: initialData.name_en,
        name_ar: initialData.name_ar,
        branch_phone_number: initialData.branch_phone_number,
        city: initialData.city,
        address: initialData.address,
        location_link: initialData.location_link || "",
        status: initialData.status as 'Active' | 'Inactive',
      });
    } else {
      setFormData({
        name_en: "",
        name_ar: "",
        branch_phone_number: "",
        city: "",
        address: "",
        location_link: "",
        status: "Active",
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, open]);

  const validateField = (name: string, value: string): string => {
    const requiredFields = ['name_en', 'name_ar', 'branch_phone_number', 'city', 'address'];
    
    if (requiredFields.includes(name) && !value.trim()) {
      return t.validation.required;
    }

    if (name === 'branch_phone_number' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 7) {
        return t.validation.invalidPhone;
      }
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key] || '');
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

    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? t.titles.edit : t.titles.add}
          </DialogTitle>
          <DialogDescription>
            {initialData ? t.messages.editDescription : t.messages.formDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Branch Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_en">
                {t.fields.name_en} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 h-4 w-4 text-gray-400`} />
                <Input
                  id="name_en"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t.placeholders.name_en}
                  className={`${isRtl ? 'pr-9' : 'pl-9'} ${touched.name_en && errors.name_en ? 'border-red-500' : ''}`}
                />
              </div>
              {touched.name_en && errors.name_en && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name_en}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_ar">
                {t.fields.name_ar} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 h-4 w-4 text-gray-400`} />
                <Input
                  id="name_ar"
                  name="name_ar"
                  dir="rtl"
                  value={formData.name_ar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t.placeholders.name_ar}
                  className={`${isRtl ? 'pr-9' : 'pl-9'} ${touched.name_ar && errors.name_ar ? 'border-red-500' : ''}`}
                />
              </div>
              {touched.name_ar && errors.name_ar && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name_ar}
                </p>
              )}
            </div>
          </div>

          {/* Phone and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch_phone_number">
                {t.fields.phone} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 h-4 w-4 text-gray-400`} />
                <Input
                  id="branch_phone_number"
                  name="branch_phone_number"
                  value={formData.branch_phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t.placeholders.phone}
                  className={`${isRtl ? 'pr-9' : 'pl-9'} ${touched.branch_phone_number && errors.branch_phone_number ? 'border-red-500' : ''}`}
                />
              </div>
              {touched.branch_phone_number && errors.branch_phone_number && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.branch_phone_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                {t.fields.city} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 h-4 w-4 text-gray-400`} />
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t.placeholders.city}
                  className={`${isRtl ? 'pr-9' : 'pl-9'} ${touched.city && errors.city ? 'border-red-500' : ''}`}
                />
              </div>
              {touched.city && errors.city && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.city}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              {t.fields.address} <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t.placeholders.address}
              rows={3}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`w-full px-3 py-2 border rounded-md ${
                touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
              } dark:border-zinc-700 dark:bg-zinc-900`}
            />
            {touched.address && errors.address && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Location Link */}
          <div className="space-y-2">
            <Label htmlFor="location_link">
              {t.fields.location_link}
            </Label>
            <div className="relative">
              <Globe className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 h-4 w-4 text-gray-400`} />
              <Input
                id="location_link"
                name="location_link"
                value={formData.location_link}
                onChange={handleChange}
                placeholder={t.placeholders.location_link}
                className={isRtl ? 'pr-9' : 'pl-9'}
              />
            </div>
          </div>

          {/* Status Toggle */}
          {initialData && (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div>
                <Label htmlFor="status-switch" className="text-sm font-medium">
                  {t.fields.status}
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.status === 'Active' ? t.messages.activeStatus : t.messages.inactiveStatus}
                </p>
              </div>
              <Switch
                id="status-switch"
                checked={formData.status === 'Active'}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, status: checked ? 'Active' : 'Inactive' })
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t.actions.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
              {initialData ? t.actions.update : t.actions.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
