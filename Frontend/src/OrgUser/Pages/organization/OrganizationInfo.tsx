import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import api, { getUploadUrl } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Loader2,
  Edit,
  MapPinned,
  Hash,
  User,
  Globe,
  Smartphone,
  UserCircle
} from "lucide-react";

export default function OrganizationInfo() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.orgAuth);
  const isOrgAdmin = user?.designation === 'Admin' || user?.designation === 'Manager';
  
  // Fetch organization data
  const { data: orgData, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', user?.org_id],
    queryFn: async () => {
      const response = await api.get(`/organization/${user?.org_id}`);
      return response.data.data.organization || response.data.data;
    },
    enabled: !!user?.org_id,
  });

  // Fetch organization users count
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['organization-users', user?.org_id],
    queryFn: async () => {
      const response = await api.get(`/organization/${user?.org_id}/users`);
      return Array.isArray(response.data.data.users) ? response.data.data.users : [];
    },
    enabled: !!user?.org_id,
  });

  const org = orgData || null;
  const users = usersData || [];
  const loading = orgLoading || usersLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
          <CardContent className="p-8 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Organization Not Found</h3>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                {org.picture ? (
                  <img 
                    src={getUploadUrl(org.picture)} 
                    alt={org.org_name_en}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {org.org_name_en || org.org_name_ar}
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
                  <Badge variant="outline" className="dark:border-zinc-700">
                    <Building2 className="w-3 h-3 mr-1" />
                    {org.type}
                  </Badge>
                </div>
              </div>
            </div>
            
            {isOrgAdmin && (
              <Button
                onClick={() => navigate(`/org/organization/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Organization
              </Button>
            )}
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Building2 className="w-5 h-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-all">{org.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Telephone</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.tel}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-100 dark:bg-zinc-800/50">
                <Globe className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Country</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPinned className="w-5 h-5 text-red-600" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-zinc-800/50">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">State</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.state || "-"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-zinc-800/50">
                <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">City</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.city}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-100 dark:bg-zinc-800/50">
                <Hash className="w-5 h-5 text-teal-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">PIN</p>
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
                Contact Person
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-200 dark:bg-zinc-800/50">
                <UserCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.contact_person}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-200 dark:bg-zinc-800/50">
                <Smartphone className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mobile</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{org.c_mobile}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-200 dark:bg-zinc-800/50">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-all">{org.c_email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information - Full Width */}
          <Card className="lg:col-span-2 dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="w-5 h-5 text-orange-600" />
                Full Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50">
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                  {org.address || "No address provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards - Full Width */}
          <Card className="lg:col-span-2 dark:bg-zinc-900 dark:border-zinc-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Organization Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{users.length}</div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">Total Users</p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {users.filter((u: any) => u.status === 'active').length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">Active Users</p>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {org.status === 'active' ? '✓' : '✗'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">Organization Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
