import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { getUploadUrl } from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "../../componets/organisations/constants";
import type { Organization, FormData, OrganizationApiResponse } from "../../componets/organisations/types";
import DataTable from "react-data-table-component";
import { Plus, Search, Building2, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import OrgForm from "@/Admin/componets/organisations/OrgForm";

export default function OrganizationList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language, theme } = useAppSelector((state) => state.settings);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const isDark = theme === 'dark';
  
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch organizations using TanStack Query
  const { data: orgData, isLoading } = useQuery<OrganizationApiResponse>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await api.get('/organization');
      return response.data;
    },
  });

  // Get organization from the response
  const organizations: Organization[] = orgData?.data?.organizations || [];

  // Create organization mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await api.post("/organization", formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      alert("Error creating organization");
    },
  });

  const handleCreate = async (formData: FormData) => {
    createMutation.mutate(formData);
  };

  // Delete organization mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/organization/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: (error) => {
      console.error(error);
      alert("Error deleting organization");
    },
  });

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    deleteMutation.mutate(id);
  };

  const filteredItems = organizations.filter((item: any) => 
    (item.org_name_en && item.org_name_en.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.org_name_ar && item.org_name_ar.includes(filterText))
  );

  const columns = [
    {
      name: t.fields.logo,
      cell: (row: any) => (
         <div className="w-10 h-10 rounded bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden my-1">
            {row.picture ? (
              <img src={getUploadUrl(row.picture)} alt="Logo" className="w-full h-full object-cover" />
            ) : <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
         </div>
      ),
      width: "80px",
      center: true
    },
    {
      name: language === 'en' ? t.fields.org_name_en : t.fields.org_name_ar,
      selector: (row: any) => language === 'en' ? row.org_name_en : row.org_name_ar,
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
               isSubmitting={createMutation.isPending}
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
           progressPending={isLoading}
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