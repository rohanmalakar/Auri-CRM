import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "./constants";
import type { Organization } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import OrgForm from "@/Admin/componets/organisations/OrgForm";


export default function OrganizationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useAppSelector((state) => state.settings);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/organization/${id}`);
        const orgData = res.data.data.organization || res.data.data;
        console.log("Edit Form",orgData);
        setOrg(orgData);
      } catch (error) {
        console.error(error);
        alert("Failed to load organization");
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [id]);

  const handleUpdate = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Always use FormData for consistency (backend now supports multipart/form-data)
      const updateFormData = new FormData();
      
      if (formData instanceof FormData) {
        // If already FormData, iterate and append
        formData.forEach((value, key) => {
          if (value !== null && value !== undefined && value !== '') {
            updateFormData.append(key, value);
          }
        });
      } else {
        // If plain object, convert to FormData
        Object.keys(formData).forEach(key => {
          const value = formData[key];
          if (value !== null && value !== undefined && value !== '') {
            updateFormData.append(key, String(value));
          }
        });
      }
      
      await api.put(`/organization/${id}`, updateFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      navigate(`/admin/organization/view/${id}`);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || "Error updating organization";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin w-8 h-8 text-pink-500" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-900 dark:text-white">
        Organization not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/admin/organization")}
            className="hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRtl ? 'rotate-180' : ''}`} />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t.titles.edit}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRtl ? 'تعديل بيانات المنظمة' : 'Update organization information'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
          <OrgForm
            initialData={org}
            onSubmit={handleUpdate}
            onCancel={() => navigate(`/admin/organization/view/${id}`)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
