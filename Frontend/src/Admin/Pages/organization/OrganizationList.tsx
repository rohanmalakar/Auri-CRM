import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "../../componets/organisations/constants";
import type { Organization, FormData } from "../../componets/organisations/types";
import DataTable from "react-data-table-component";
import { Plus, Search, Building2, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import OrgForm from "@/Admin/componets/organisations/OrgForm";

export default function OrganizationList() {
  const navigate = useNavigate();
  const { language, theme } = useAppSelector((state) => state.settings);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const isDark = theme === 'dark';
  
  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      // const res = await api.get("/organization");
      // setData(res.data);
      // Temporary dummy data until API is ready
      const dummyData = [
        {
          org_id: "1",
          name_en: "Tech Innovations Inc",
          name_ar: "شركة الابتكارات التقنية",
          email: "contact@techinnovations.com",
          tel: "+1 (555) 123-4567",
          country: "United States",
          state: "California",
          city: "San Francisco",
          pin: "94102",
          contact_person: "John Anderson",
          c_mobile: "+1 (555) 123-4567",
          c_email: "john.anderson@techinnovations.com",
          type: "Technology",
          status: "active",
          picture: null
        },
        {
          org_id: "2",
          name_en: "Global Retail Solutions",
          name_ar: "حلول التجزئة العالمية",
          email: "info@globalretail.com",
          tel: "+44 20 7946 0958",
          country: "United Kingdom",
          state: "England",
          city: "London",
          pin: "SW1A 1AA",
          contact_person: "Sarah Thompson",
          c_mobile: "+44 7700 900123",
          c_email: "sarah.t@globalretail.com",
          type: "Retail",
          status: "active",
          picture: null
        },
        {
          org_id: "3",
          name_en: "Healthcare Plus",
          name_ar: "الرعاية الصحية بلس",
          email: "contact@healthcareplus.sa",
          tel: "+966 11 234 5678",
          country: "Saudi Arabia",
          state: "Riyadh Region",
          city: "Riyadh",
          pin: "11564",
          contact_person: "Ahmed Al-Rashid",
          c_mobile: "+966 50 123 4567",
          c_email: "ahmed.rashid@healthcareplus.sa",
          type: "Healthcare",
          status: "active",
          picture: null
        },
        {
          org_id: "4",
          name_en: "Education Hub",
          name_ar: "مركز التعليم",
          email: "admin@educationhub.ae",
          tel: "+971 4 123 4567",
          country: "United Arab Emirates",
          state: "Dubai",
          city: "Dubai",
          pin: "00000",
          contact_person: "Fatima Al-Mansoori",
          c_mobile: "+971 50 987 6543",
          c_email: "fatima.m@educationhub.ae",
          type: "Education",
          status: "active",
          picture: null
        },
        {
          org_id: "5",
          name_en: "Finance Pro Services",
          name_ar: "خدمات المالية المحترفة",
          email: "support@financepro.com",
          tel: "+1 (212) 555-7890",
          country: "United States",
          state: "New York",
          city: "New York",
          pin: "10001",
          contact_person: "Michael Chen",
          c_mobile: "+1 (212) 555-7891",
          c_email: "m.chen@financepro.com",
          type: "Finance",
          status: "inactive",
          picture: null
        },
        {
          org_id: "6",
          name_en: "Smart Manufacturing Co",
          name_ar: "شركة التصنيع الذكي",
          email: "info@smartmfg.de",
          tel: "+49 30 12345678",
          country: "Germany",
          state: "Berlin",
          city: "Berlin",
          pin: "10115",
          contact_person: "Hans Mueller",
          c_mobile: "+49 170 1234567",
          c_email: "h.mueller@smartmfg.de",
          type: "Manufacturing",
          status: "active",
          picture: null
        },
        {
          org_id: "7",
          name_en: "Logistics Express",
          name_ar: "الخدمات اللوجستية السريعة",
          email: "contact@logisticsexp.cn",
          tel: "+86 21 1234 5678",
          country: "China",
          state: "Shanghai",
          city: "Shanghai",
          pin: "200000",
          contact_person: "Li Wei",
          c_mobile: "+86 138 1234 5678",
          c_email: "li.wei@logisticsexp.cn",
          type: "Logistics",
          status: "active",
          picture: null
        },
        {
          org_id: "8",
          name_en: "Green Energy Solutions",
          name_ar: "حلول الطاقة الخضراء",
          email: "info@greenenergy.com.au",
          tel: "+61 2 9876 5432",
          country: "Australia",
          state: "New South Wales",
          city: "Sydney",
          pin: "2000",
          contact_person: "Emma Wilson",
          c_mobile: "+61 412 345 678",
          c_email: "e.wilson@greenenergy.com.au",
          type: "Energy",
          status: "active",
          picture: null
        },
        {
          org_id: "9",
          name_en: "Media & Entertainment Group",
          name_ar: "مجموعة الإعلام والترفيه",
          email: "contact@mediaent.fr",
          tel: "+33 1 23 45 67 89",
          country: "France",
          state: "Île-de-France",
          city: "Paris",
          pin: "75001",
          contact_person: "Marie Dubois",
          c_mobile: "+33 6 12 34 56 78",
          c_email: "m.dubois@mediaent.fr",
          type: "Media",
          status: "inactive",
          picture: null
        },
        {
          org_id: "10",
          name_en: "Construction Masters",
          name_ar: "أساتذة البناء",
          email: "info@constructionmasters.ca",
          tel: "+1 (416) 555-9876",
          country: "Canada",
          state: "Ontario",
          city: "Toronto",
          pin: "M5H 2N2",
          contact_person: "David Brown",
          c_mobile: "+1 (416) 555-9877",
          c_email: "d.brown@constructionmasters.ca",
          type: "Construction",
          status: "active",
          picture: null
        }
      ];
      setData(dummyData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreate = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/organization", formData, { headers: { "Content-Type": "multipart/form-data" } });
      fetchOrgs();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error creating organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await api.delete(`/organization/${id}`);
      setData(prev => prev.filter((item: any) => item.org_id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = data.filter((item: any) => 
    (item.name_en && item.name_en.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.name_ar && item.name_ar.includes(filterText))
  );

  const columns = [
    {
      name: t.fields.logo,
      cell: (row: any) => (
         <div className="w-10 h-10 rounded bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden my-1">
            {row.picture ? (
              <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${row.picture}`} alt="Logo" className="w-full h-full object-cover" />
            ) : <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
         </div>
      ),
      width: "80px",
      center: true
    },
    {
      name: language === 'en' ? t.fields.name_en : t.fields.name_ar,
      selector: (row: any) => language === 'en' ? row.name_en : row.name_ar,
      sortable: true,
      grow: 2
    },
    {
      name: t.fields.email,
      selector: (row: any) => row.email,
      sortable: true
    },
    {
      name: t.fields.phone,
      selector: (row: any) => row.tel,
      sortable: true
    },
    {
      name: t.fields.status,
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {row.status}
        </span>
      ),
      width: "100px",
      center: true
    },
    {
      name: "",
      cell: (row: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/organization/view/${row.org_id}`)}>
             <Eye className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/organization/edit/${row.org_id}`)}>
             <Pencil className="w-4 h-4 text-orange-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.org_id)}>
             <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
      width: "150px"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-zinc-950 min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.titles.list}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your organizations and their details</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white gap-2">
              <Plus className="w-4 h-4" /> {t.actions.submit}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] lg:min-w-5xl lg:max-w-6xl dark:bg-zinc-950 bg-white overflow-y-auto border-gray-200 dark:border-zinc-800">
             <OrgForm 
               onSubmit={handleCreate} 
               onCancel={() => setIsModalOpen(false)}
               isSubmitting={isSubmitting}
             />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm p-4">
        <div className="flex items-center mb-4 border border-gray-200 dark:border-zinc-700 rounded-md px-3 bg-gray-50 dark:bg-zinc-800 max-w-sm">
           <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
           <Input 
             placeholder={t.actions.search} 
             className="border-0 bg-transparent focus-visible:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
             value={filterText}
             onChange={e => setFilterText(e.target.value)}
           />
        </div>

        <DataTable
           columns={columns}
           data={filteredItems}
           pagination
           progressPending={loading}
           highlightOnHover
           pointerOnHover
           onRowClicked={(row) => navigate(`/admin/organization/view/${row.org_id}`)}
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
                   cursor: 'pointer',
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
        />
      </div>
    </div>
  );
}