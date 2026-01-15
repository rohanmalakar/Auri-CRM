import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "@/Admin/componets/organisations/constants";
import type { Organization, OrganizationUser } from "@/Admin/componets/organisations/types";
import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building2, User, Globe, ArrowLeft, Loader2, Trash2 } from "lucide-react";

export default function OrganizationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, theme } = useAppSelector((state) => state.settings);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const isDark = theme === 'dark';

  const [org, setOrg] = useState<Organization | null>(null);
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Org and Users in parallel
        const [orgRes, userRes] = await Promise.all([
           api.get(`/organization/${id}`),
           api.get(`/organization/${id}/users`)
        ]);
        
        setOrg(Array.isArray(orgRes.data) ? orgRes.data[0] : orgRes.data);
        setUsers(Array.isArray(userRes.data) ? userRes.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteUser = async (userId: string) => {
    if(!confirm("Delete this user?")) return;
    try {
      await api.delete(`/organization/${id}/users/${userId}`);
      setUsers(prev => prev.filter(u => (u.org_user_id || u.user_id) !== userId));
    } catch(err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // User Table Columns
  const userColumns = [
    {
      name: t.fields.logo,
      cell: (row: any) => (
         <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            {row.picture ? (
              <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${row.picture}`} className="w-full h-full object-cover" />
            ) : <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
         </div>
      ),
      width: "60px",
      center: true
    },
    {
      name: t.fields.name_en, // Using generic name field
      selector: (row: any) => row.name || row.username,
      sortable: true
    },
    {
      name: t.fields.email,
      selector: (row: any) => row.email,
      sortable: true
    },
    {
      name: t.fields.type,
      selector: (row: any) => row.type || "User",
      sortable: true
    },
    {
      name: t.fields.status,
      cell: (row: any) => (
        <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className={row.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'}>
          {row.status}
        </Badge>
      )
    },
    {
      name: "",
      cell: (row: any) => (
        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(row.org_user_id || row.user_id)} className="text-red-500 hover:text-red-600">
           <Trash2 className="w-4 h-4" />
        </Button>
      ),
      width: "80px"
    }
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950"><Loader2 className="animate-spin w-8 h-8 text-pink-500" /></div>;
  if (!org) return <div className="h-screen flex items-center justify-center text-gray-900 dark:text-white">Not Found</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-zinc-950 min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/organization")}>
          <ArrowLeft className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRtl ? 'rotate-180' : ''}`} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
             {language === 'en' ? org.name_en : org.name_ar}
             <Badge variant={org.status === 'active' ? 'default' : 'destructive'} className={org.status === 'active' ? 'bg-green-500' : ''}>
               {org.status}
             </Badge>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{org.type}</p>
        </div>
        <Button onClick={() => navigate(`/admin/organization/edit/${id}`)} variant="outline" className="bg-white dark:bg-zinc-900 dark:text-white dark:border-zinc-700">
          {t.actions.edit}
        </Button>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Basic Info */}
        <Card className="border-gray-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
           <CardContent className="pt-6 flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-4 overflow-hidden">
                {org.picture ? (
                   <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${org.picture}`} className="w-full h-full object-cover" />
                ) : <Building2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />}
             </div>
             <div className="w-full space-y-3 text-sm text-left">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                   <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {org.email}
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                   <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {org.tel}
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                   <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {org.country}
                </div>
             </div>
           </CardContent>
        </Card>

        {/* Location Info */}
        <Card className="border-gray-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
           <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><MapPin className="w-4 h-4 text-pink-500" /> {t.fields.city}</h3>
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">{t.fields.state}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{org.state || "-"}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">{t.fields.city}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{org.city}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">{t.fields.pin}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{org.pin || "-"}</span>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Contact Person Info */}
        <Card className="border-gray-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
           <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><User className="w-4 h-4 text-pink-500" /> {t.fields.contact_person}</h3>
              <div className="space-y-3 text-sm">
                 <div className="font-medium text-lg text-gray-900 dark:text-white">{org.contact_person}</div>
                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-3 h-3" /> {org.c_mobile}
                 </div>
                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-3 h-3" /> {org.c_email}
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Users Section (Directly embedded, no tabs) */}
      <Card className="border-gray-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
         <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 rounded-t-lg">
               <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  {t.titles.users}
                  <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">{users.length}</Badge>
               </h3>
               {/* <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
                  {t.actions.addUser}
               </Button> */}
            </div>
            
            <DataTable
               columns={userColumns}
               data={users}
               pagination
               highlightOnHover
               customStyles={{
                 table: {
                   style: {
                     backgroundColor: 'transparent',
                   },
                 },
                 headRow: {
                   style: {
                     backgroundColor: isDark ? '#18181b' : '#f9fafb',
                     borderBottom: isDark ? '1px solid #27272a' : '1px solid #e5e7eb',
                     color: isDark ? '#f4f4f5' : '#111827',
                   },
                 },
                 headCells: {
                   style: {
                     fontSize: '14px',
                     fontWeight: '600',
                     color: isDark ? '#a1a1aa' : '#6b7280',
                   },
                 },
                 rows: {
                   style: {
                     fontSize: '14px',
                     backgroundColor: isDark ? '#09090b' : '#ffffff',
                     borderBottom: isDark ? '1px solid #27272a' : '1px solid #f3f4f6',
                     color: isDark ? '#f4f4f5' : '#111827',
                     '&:hover': {
                       backgroundColor: isDark ? '#18181b' : '#f9fafb',
                     },
                   },
                 },
                 pagination: {
                   style: {
                     backgroundColor: isDark ? '#09090b' : '#ffffff',
                     borderTop: isDark ? '1px solid #27272a' : '1px solid #e5e7eb',
                     color: isDark ? '#f4f4f5' : '#111827',
                   },
                   pageButtonsStyle: {
                     fill: isDark ? '#a1a1aa' : '#6b7280',
                     '&:hover:not(:disabled)': {
                       backgroundColor: isDark ? '#27272a' : '#f3f4f6',
                     },
                   },
                 },
               }}
               noDataComponent={<div className="p-8 text-center text-gray-500 dark:text-gray-400">No users found for this organization.</div>}
            />
         </CardContent>
      </Card>
    </div>
  );
}