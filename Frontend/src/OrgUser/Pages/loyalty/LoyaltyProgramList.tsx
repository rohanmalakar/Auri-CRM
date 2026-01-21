import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import DataTable from "react-data-table-component";
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  Coins, 
  Stamp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Types ---
interface LoyaltyProgram {
  program_id: string;
  org_id: string;
  program_type: 'POINTS' | 'STAMPS';
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

interface LoyaltyApiResponse {
  success: boolean;
  data: {
    programs: LoyaltyProgram[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}

// --- Translations ---
export const TRANSLATIONS = {
  en: {
    titles: {
      loyalty_list: "Loyalty Programs",
      loyalty_subtitle: "Manage your points and stamp cards",
    },
    fields: {
      status: "Status",
      created_at: "Created At",
    },
    actions: {
      search: "Search...",
      new_program: "New Program",
    },
  },
  ar: {
    titles: {
      loyalty_list: "برامج الولاء",
      loyalty_subtitle: "إدارة نقاطك وبطاقات الطوابع",
    },
    fields: {
      status: "الحالة",
      created_at: "تاريخ الإنشاء",
    },
    actions: {
      search: "بحث...",
      new_program: "برنامج جديد",
    },
  },
};

export default function LoyaltyProgramList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language, theme } = useAppSelector((state) => state.settings);
  
  // Translation helpers
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const isDark = theme === 'dark';
  
  const [filterText, setFilterText] = useState("");

  // 1. Fetch Loyalty Programs
  const { data: programData, isLoading } = useQuery<LoyaltyApiResponse>({
    queryKey: ['loyalty-programs'],
    queryFn: async () => {
      const response = await api.get('/loyalty/programs/all/' + JSON.parse(localStorage.getItem('orgUser') || '{}').org_id); 
      return response.data;
    },
  });

  const programs = programData?.data?.programs || [];

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/loyalty-program/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-programs'] });
    },
    onError: (error) => {
      console.error(error);
      alert("Error deleting program");
    },
  });

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this program?")) return;
    deleteMutation.mutate(id);
  };

  // 3. Client-side Filtering
  const filteredItems = programs.filter((item) => 
    (item.name_en && item.name_en.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.name_ar && item.name_ar.includes(filterText))
  );

  // 4. Table Columns
  const columns = [
    {
      name: "Type",
      cell: (row: LoyaltyProgram) => (
         <div className={`w-10 h-10 rounded flex items-center justify-center border 
           ${row.program_type === 'POINTS' 
             ? 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800' 
             : 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800'
           }`}>
            {row.program_type === 'POINTS' ? <Coins className="w-5 h-5" /> : <Stamp className="w-5 h-5" />}
         </div>
      ),
      width: "80px",
      center: true
    },
    {
      name: language === 'en' ? "Program Name" : "اسم البرنامج",
      selector: (row: LoyaltyProgram) => language === 'en' ? row.name_en : row.name_ar,
      sortable: true,
      grow: 2
    },
    {
      name: language === 'en' ? "Type" : "النوع",
      selector: (row: LoyaltyProgram) => row.program_type,
      sortable: true,
      cell: (row: LoyaltyProgram) => (
        <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
            {row.program_type}
        </span>
      )
    },
    {
      name: t.fields.status,
      cell: (row: LoyaltyProgram) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium 
          ${row.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {row.status}
        </span>
      ),
      width: "100px",
      center: true
    },
    {
        name: language === 'en' ? "Created At" : "تاريخ الإنشاء",
        selector: (row: LoyaltyProgram) => row.created_at,
        format: (row: LoyaltyProgram) => new Date(row.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG'),
        sortable: true,
        width: "150px"
    },
    {
      name: "",
      cell: (row: LoyaltyProgram) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/loyalty/view/${row.program_id}`)}>
             <Eye className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/loyalty/edit/${row.program_id}`)}>
             <Pencil className="w-4 h-4 text-orange-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.program_id)}>
             <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
      width: "150px"
    }
  ];

  // Custom Styles for Data Table
  const customTableStyles = {
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
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-zinc-950 min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.titles.loyalty_list}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t.titles.loyalty_subtitle}
          </p>
        </div>
        
        {/* Changed: Navigate to Create Route instead of opening Dialog */}
        <Button 
          className="bg-pink-600 hover:bg-pink-700 text-white gap-2"
          onClick={() => navigate('/org/loyalty/program/create')}
        >
          <Plus className="w-4 h-4" /> 
          {t.actions.new_program}
        </Button>
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
           paginationServer={false}
           progressPending={isLoading}
           highlightOnHover
           pointerOnHover
           onRowClicked={(row) => navigate(`/org/loyalty/view/${row.program_id}`)}
           customStyles={customTableStyles}
        />
      </div>
    </div>
  );
}