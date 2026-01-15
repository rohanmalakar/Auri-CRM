import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "./constants";
import type { Organization, FormData } from "./types";
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
        const orgData = Array.isArray(res.data) ? res.data[0] : res.data;
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

  const handleUpdate = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/organization/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate(`/admin/organization/view/${id}`);
    } catch (error) {
      console.error(error);
      alert("Error updating organization");
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
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-zinc-950 min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/organization")}>
          <ArrowLeft className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRtl ? 'rotate-180' : ''}`} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.titles.edit}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isRtl ? 'تعديل بيانات المنظمة' : 'Update organization information'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
        <OrgForm
          initialData={org}
          onSubmit={handleUpdate}
          onCancel={() => navigate(`/admin/organization/view/${id}`)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
