
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "@/Admin/componets/organisations/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUploadUrl } from "@/utils/api";
import OrganizationUsersList from "./OrganizationUsersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  User, 
  Globe, 
  ArrowLeft, 
  Loader2,
  Edit,
  MapPinned,
  Hash,
  UserCircle,
  Smartphone,
} from "lucide-react";

export default function OrganizationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useAppSelector((state) => state.settings);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  // Fetch organization data using TanStack Query
  const { data: orgData, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const response = await api.get(`/organization/${id}`);
      return response.data.data.organization || response.data.data;
    },
    enabled: !!id,
  });

  // Fetch organization users using TanStack Query
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['organization-users', id],
    queryFn: async () => {
      const response = await api.get(`/organization/${id}/users`);
      return Array.isArray(response.data.data.users) ? response.data.data.users : [];
    },
    enabled: !!id,
  });

  const org = orgData || null;
  const users = usersData || [];
  const loading = orgLoading || usersLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
          <CardContent className="p-8 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Organization Not Found
            </h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/admin/organization")}
            variant="ghost"
            className="mb-4 hover:bg-white dark:hover:bg-zinc-800"
            type="button"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
            {t.actions.back || "Back"}
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                {org.picture ? (
                  <img 
                    src={getUploadUrl(org.picture)} 
                    alt={language === 'en' ? org.org_name_en : org.org_name_ar}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'en' ? org.org_name_en : org.org_name_ar}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={org.status === 'Active' ? 'default' : 'secondary'}
                    className={org.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }
                  >
                    {org.status}
                  </Badge>
                  {org.type && (
                    <Badge variant="outline" className="dark:border-zinc-700">
                      <Building2 className={`w-3 h-3 ${isRtl ? 'ml-1' : 'mr-1'}`} />
                      {org.type}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => navigate(`/admin/organization/edit/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Edit className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
              {t.actions.edit}
            </Button>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basic Info */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Building2 className="w-5 h-5 text-blue-600" />
                {t.fields.basic_info || "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.email}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-all">{org.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.tel || "Telephone"}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.tel || "-"}</p>
                </div>
              </div>
              
              {org.vat_no && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                  <Hash className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.vat_no}</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{org.vat_no}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Globe className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.country}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.country || "-"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Globe className="w-5 h-5 text-teal-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.currency}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.currency}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Globe className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.timezone}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.timezone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPinned className="w-5 h-5 text-red-600" />
                {t.fields.location || "Location Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-zinc-800/50">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.state}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.state || "-"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-zinc-800/50">
                <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.city}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.city}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-zinc-800/50">
                <Hash className="w-5 h-5 text-teal-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.pin}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.pin || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person Info - Full Width */}
          <Card className="lg:col-span-2 dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <User className="w-5 h-5 text-indigo-600" />
                {t.fields.contact_person}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-200 dark:bg-zinc-800/50">
                <UserCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.name_en || "Name"}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.contact_person}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-200 dark:bg-zinc-800/50">
                <Smartphone className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.mobile || "Mobile"}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.c_mobile}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-200 dark:bg-zinc-800/50">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fields.email}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-all">{org.c_email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Section */}
        <OrganizationUsersList
          organizationId={id}
          users={users}
          isLoading={usersLoading}
        />
      </div>
    </div>
  );
}