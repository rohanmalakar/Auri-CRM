import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";
import { branchApiService } from "@/utils/orgUserApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DataTable from "react-data-table-component";
import { Plus, Search, Building2, Pencil, Trash2, MapPin, Phone, Loader2, AlertCircle } from "lucide-react";
import BranchForm from "@/OrgUser/components/branches/BranchForm";
import { BRANCH_TRANSLATIONS } from "@/OrgUser/components/branches/constants";
import type { Branch, BranchFormData } from "@/OrgUser/components/branches/types";

export default function BranchManagement() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.orgAuth);
  const { theme, language } = useAppSelector((state) => state.settings);
  const isDark = theme === "dark";
  const t = BRANCH_TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [filterText, setFilterText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Check if user is admin or manager
  const isAdminOrManager = user?.designation === 'Admin' || user?.designation === 'Manager';
  const isCashier = user?.designation === 'Cashier';

  // Fetch branches
  const { data: branchesData, isLoading } = useQuery({
    queryKey: ['branches', user?.org_id],
    queryFn: async () => {
      const response = await branchApiService.getAllBranches(user?.org_id || '');
      return response.data.data.branches;
    },
    enabled: !!user?.org_id,
  });

  const branches: Branch[] = branchesData || [];

  // Create branch mutation
  const createMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      return await branchApiService.createBranch(user?.org_id || '', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error?.message || t.messages.createError;
      alert(errorMsg);
    },
  });

  // Update branch mutation
  const updateMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      if (!selectedBranch) throw new Error("No branch selected");
      return await branchApiService.updateBranch(selectedBranch.branch_id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setIsEditModalOpen(false);
      setSelectedBranch(null);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error?.message || t.messages.updateError;
      alert(errorMsg);
    },
  });

  // Delete branch mutation
  const deleteMutation = useMutation({
    mutationFn: async (branchId: string) => {
      return await branchApiService.deleteBranch(branchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setIsDeleteModalOpen(false);
      setSelectedBranch(null);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error?.message || t.messages.deleteError;
      alert(errorMsg);
    },
  });

  const handleCreate = async (data: BranchFormData) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (data: BranchFormData) => {
    await updateMutation.mutateAsync(data);
  };

  const handleDelete = () => {
    if (selectedBranch) {
      deleteMutation.mutate(selectedBranch.branch_id);
    }
  };

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  // Filter branches
  const filteredBranches = branches.filter((branch) =>
    branch.name_en.toLowerCase().includes(filterText.toLowerCase()) ||
    branch.name_ar.includes(filterText) ||
    branch.city.toLowerCase().includes(filterText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      name: t.fields.name,
      selector: (row: Branch) => row.name_en,
      sortable: true,
      grow: 2,
      cell: (row: Branch) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{row.name_en}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400" dir="rtl">{row.name_ar}</div>
        </div>
      ),
    },
    {
      name: t.fields.city,
      selector: (row: Branch) => row.city,
      sortable: true,
      cell: (row: Branch) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{row.city}</span>
        </div>
      ),
    },
    {
      name: t.fields.phone,
      selector: (row: Branch) => row.branch_phone_number,
      sortable: true,
      cell: (row: Branch) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{row.branch_phone_number}</span>
        </div>
      ),
    },
    {
      name: t.fields.status,
      selector: (row: Branch) => row.status,
      sortable: true,
      width: "120px",
      cell: (row: Branch) => (
        <Badge
          variant={row.status === 'Active' ? 'default' : 'secondary'}
          className={
            row.status === 'Active'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }
        >
          {row.status === 'Active' ? t.messages.active : t.messages.inactive}
        </Badge>
      ),
    },
    {
      name: t.fields.actions,
      width: "150px",
      cell: (row: Branch) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditModal(row)}
            disabled={!isAdminOrManager}
            title={!isAdminOrManager ? t.messages.editTooltip : t.actions.edit}
          >
            <Pencil className="w-4 h-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteModal(row)}
            disabled={!isAdminOrManager}
            title={!isAdminOrManager ? t.messages.deleteTooltip : t.actions.delete}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  // Access restriction for non-admin users
  if (!isAdminOrManager) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <Card className="max-w-md">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.messages.accessRestricted}</h3>
              <p className="text-gray-600 dark:text-zinc-400">
                {t.messages.noPermission}
                {isCashier && ` ${t.messages.cashierRestriction}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.titles.management}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t.messages.subtitle}</p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> {t.actions.addBranch}
        </Button>
      </div>

      {/* Table Card */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardContent className="p-4">
          {/* Search */}
          <div className="flex items-center mb-4 border border-gray-200 dark:border-zinc-700 rounded-md px-3 bg-gray-50 dark:bg-zinc-800 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder={t.placeholders.search}
              className="border-0 bg-transparent focus-visible:ring-0"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredBranches}
            pagination
            progressPending={isLoading}
            progressComponent={
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
              </div>
            }
            highlightOnHover
            pointerOnHover
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
          />
        </CardContent>
      </Card>

      {/* Create Branch Modal */}
      <BranchForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Branch Modal */}
      <BranchForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleUpdate}
        initialData={selectedBranch}
        isSubmitting={updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white dark:bg-black" dir={isRtl ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              {t.titles.delete}
            </DialogTitle>
            <DialogDescription>
              {t.messages.deleteConfirmation} <strong>{selectedBranch?.name_en}</strong>?
              {' '}{t.messages.deleteWarning}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
              {t.actions.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
