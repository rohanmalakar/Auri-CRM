import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Loader2, 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Upload,
  AlertCircle 
} from "lucide-react";

interface FormData {
  org_name_en: string;
  org_name_ar: string;
  email: string;
  vat_no: string;
  tel: string;
  country: string;
  state: string;
  city: string;
  pin: string;
  contact_person: string;
  c_mobile: string;
  c_email: string;
  type: string;
  currency: string;
  timezone: string;
  status: 'Active' | 'Inactive';
}

export default function OrganizationEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.orgAuth);
  const isOrgAdmin = user?.designation === 'Admin' || user?.designation === 'Manager';
  const isCashier = user?.designation === 'Cashier';
  
  const [formData, setFormData] = useState<FormData>({
    org_name_en: "",
    org_name_ar: "",
    email: "",
    vat_no: "",
    tel: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    contact_person: "",
    c_mobile: "",
    c_email: "",
    type: "",
    currency: "USD",
    timezone: "UTC",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Fetch organization data
  const { data: orgData, isLoading } = useQuery({
    queryKey: ['organization', user?.org_id],
    queryFn: async () => {
      const response = await api.get(`/organization/${user?.org_id}`);
      return response.data.data.organization || response.data.data;
    },
    enabled: !!user?.org_id && isOrgAdmin,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData | FormData) => {
      const updateFormData = new FormData();
      
      if (data instanceof FormData) {
        data.forEach((value, key) => {
          if (value !== null && value !== undefined && value !== '') {
            updateFormData.append(key, value);
          }
        });
      } else {
        Object.keys(data).forEach(key => {
          const value = (data as any)[key];
          if (value !== null && value !== undefined && value !== '') {
            updateFormData.append(key, String(value));
          }
        });
      }

      // Add picture if uploaded
      if (file) {
        updateFormData.append('picture', file);
      }

      const response = await api.put(`/orgUser/organization`, updateFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', user?.org_id] });
      navigate('/org/organization');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || "Error updating organization";
      alert(errorMsg);
    }
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (orgData) {
      setFormData({
        org_name_en: orgData.org_name_en || "",
        org_name_ar: orgData.org_name_ar || "",
        email: orgData.email || "",
        vat_no: orgData.vat_no || "",
        tel: orgData.tel || "",
        country: orgData.country || "",
        state: orgData.state || "",
        city: orgData.city || "",
        pin: orgData.pin || "",
        contact_person: orgData.contact_person || "",
        c_mobile: orgData.c_mobile || "",
        c_email: orgData.c_email || "",
        type: orgData.type || "",
        currency: orgData.currency || "USD",
        timezone: orgData.timezone || "UTC",
        status: orgData.status || "Active",
      });
    }
  }, [orgData]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 7 && re.test(phone);
  };

  const validateField = (name: string, value: string): string => {
    const requiredFields = ['org_name_en', 'org_name_ar', 'email', 'tel', 'country', 'city', 'contact_person', 'c_mobile', 'c_email', 'currency', 'timezone'];
    
    if (requiredFields.includes(name) && !value.trim()) {
      return 'This field is required';
    }

    if ((name === 'email' || name === 'c_email') && value && !validateEmail(value)) {
      return 'Invalid email address';
    }

    if ((name === 'tel' || name === 'c_mobile') && value && !validatePhone(value)) {
      return 'Invalid phone number';
    }

    if (name === 'vat_no' && value && (value.length < 5 || value.length > 30)) {
      return 'VAT number must be between 5 and 30 characters';
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key]);
      if (error) newErrors[key] = error;
      newTouched[key] = true;
    });
    
    setErrors(newErrors);
    setTouched(newTouched);
    
    if (Object.keys(newErrors).length === 0) {
      updateMutation.mutate(formData);
    }
  };

  if (!isOrgAdmin) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <Card className="max-w-md">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
              <p className="text-gray-600 dark:text-zinc-400">
                Only Admins and Managers can edit organization details.
                {isCashier && " Cashiers have read-only access."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-900 dark:text-white">
        Organization not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/org/organization")}
            className="hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Edit Organization</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update organization information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Logo */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Organization Logo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {preview || orgData.picture ? (
                    <img 
                      src={preview || (orgData.picture ? `${import.meta.env.VITE_API_URL}/uploads/${orgData.picture}` : '')} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="dark:bg-zinc-800 dark:border-zinc-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PNG, JPG or WEBP (max. 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="org_name_en"
                label="Organization Name (English)"
                required
                icon={Building2}
                value={formData.org_name_en}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.org_name_en}
                touched={touched.org_name_en}
              />
              <InputField
                name="org_name_ar"
                label="Organization Name (Arabic)"
                required
                icon={Building2}
                value={formData.org_name_ar}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.org_name_ar}
                touched={touched.org_name_ar}
                dir="rtl"
              />
              <InputField
                name="email"
                label="Email"
                type="email"
                required
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
              />
              <InputField
                name="tel"
                label="Phone"
                required
                icon={Phone}
                value={formData.tel}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.tel}
                touched={touched.tel}
              />
              <InputField
                name="vat_no"
                label="VAT Number"
                icon={Building2}
                value={formData.vat_no}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.vat_no}
                touched={touched.vat_no}
              />
              <InputField
                name="type"
                label="Organization Type"
                icon={Building2}
                value={formData.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.type}
                touched={touched.type}
              />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="country"
                label="Country"
                required
                icon={Globe}
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.country}
                touched={touched.country}
              />
              <InputField
                name="state"
                label="State"
                icon={MapPin}
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.state}
                touched={touched.state}
              />
              <InputField
                name="city"
                label="City"
                required
                icon={MapPin}
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city}
                touched={touched.city}
              />
              <InputField
                name="pin"
                label="PIN Code"
                icon={MapPin}
                value={formData.pin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.pin}
                touched={touched.pin}
              />
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Person
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="contact_person"
                label="Contact Person Name"
                required
                icon={User}
                value={formData.contact_person}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.contact_person}
                touched={touched.contact_person}
              />
              <InputField
                name="c_mobile"
                label="Contact Mobile"
                required
                icon={Phone}
                value={formData.c_mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.c_mobile}
                touched={touched.c_mobile}
              />
              <InputField
                name="c_email"
                label="Contact Email"
                type="email"
                required
                icon={Mail}
                value={formData.c_email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.c_email}
                touched={touched.c_email}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/org/organization')}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Organization'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// InputField Component
interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  icon?: any;
  dir?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
}

function InputField({
  name,
  label,
  type = "text",
  required = false,
  icon: Icon,
  dir,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          dir={dir}
          placeholder={placeholder}
          className={`
            ${Icon ? 'pl-9' : ''}
            dark:bg-zinc-800 dark:border-zinc-700
            ${touched && error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
        />
      </div>
      {touched && error && (
        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
