import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";
import { orgUserApiService } from "@/utils/orgUserApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable from "react-data-table-component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  UserPlus, 
  Trash2, 
  Shield,
  Loader2,
  UserCircle,
  Search
} from "lucide-react";
import CreateUserDialog from "@/OrgUser/components/users/CreateUserDialog";
import { USER_TRANSLATIONS } from "@/OrgUser/components/users/constants";
import type { OrgUserType } from "@/OrgUser/components/users/types";
import { getUploadUrl } from "@/utils/api";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.orgAuth);
  const { theme, language } = useAppSelector((state) => state.settings);
  const t = USER_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<OrgUserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isOrgAdmin = user?.designation === 'Admin' || user?.designation === 'Manager';
  const isCashier = user?.designation === 'Cashier';
  const isDark = theme === "dark";

  // Fetch users using TanStack Query
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['org-users', user?.org_id],
    queryFn: async () => {
      const response = await orgUserApiService.getAllUsers();
      const data = response.data.data;
      // Ensure we always return an array
      if (Array.isArray(data)) return data;
      if (data?.users && Array.isArray(data.users)) return data.users;
      return [];
    },
    enabled: !!user?.org_id && isOrgAdmin,
  });

  const users = Array.isArray(usersData) ? usersData : [];

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.tel && user.tel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await orgUserApiService.deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["org-users", user?.org_id],
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to delete user");
    },
  });

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.org_user_id);
    }
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["org-users", user?.org_id],
    });
  };

  // DataTable columns
  const userColumns = [
    {
      name: t.fields.logo,
      cell: (row: OrgUserType) => (
        <div className="flex items-center justify-center w-10 h-10">
          {row.picture ? (
            <img
              src={getUploadUrl(row.picture)}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-zinc-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      ),
      width: "80px",
      center: true,
    },
    {
      name: t.fields.name,
      selector: (row: OrgUserType) => row.name,
      sortable: true,
      cell: (row: OrgUserType) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.name}
        </div>
      ),
    },
    {
      name: t.fields.email,
      selector: (row: OrgUserType) => row.email,
      sortable: true,
      cell: (row: OrgUserType) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          {row.email}
        </div>
      ),
    },
    {
      name: t.fields.status,
      selector: (row: OrgUserType) => row.status || 'Active',
      sortable: true,
      cell: (row: OrgUserType) => (
        <Badge 
          variant="outline" 
          className={row.status === 'Active' 
            ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" 
            : "border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
          }
        >
          {row.status === 'Active' ? t.messages.active : t.messages.inactive}
        </Badge>
      ),
    },
    {
      name: t.fields.phone,
      selector: (row: OrgUserType) => row.tel || "-",
      sortable: true,
      cell: (row: OrgUserType) => (
        <div className="text-gray-600 dark:text-gray-400">
          {row.tel || "-"}
        </div>
      ),
    },
    {
      name: t.fields.designation,
      selector: (row: OrgUserType) => row.designation || "-",
      sortable: true,
      cell: (row: OrgUserType) => (
        <div className="text-gray-600 dark:text-gray-400">
          {row.designation || "-"}
        </div>
      ),
    },
    {
      name: t.fields.branch,
      selector: (row: OrgUserType) => row.designation || "-",
      sortable: true,
      cell: (row: OrgUserType) => (
        <div className="text-gray-600 dark:text-gray-400">
          {row.designation  || "-"}
        </div>
      ),
    },
    {
      name: t.fields.actions,
      cell: (row: OrgUserType) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setUserToDelete(row);
            setDeleteDialogOpen(true);
          }}
          disabled={deleteUserMutation.isPending || row.designation === 'Admin'}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50"
        >
          {deleteUserMutation.isPending && userToDelete?.org_user_id === row.org_user_id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      ),
      width: "80px",
      center: true,
    },
  ];

  // Custom styles for DataTable
  const customStyles = {
    table: {
      style: {
        backgroundColor: isDark ? "rgb(24 24 27)" : "white",
      },
    },
    headRow: {
      style: {
        backgroundColor: isDark ? "rgb(39 39 42)" : "rgb(249 250 251)",
        borderBottomColor: isDark ? "rgb(63 63 70)" : "rgb(229 231 235)",
        minHeight: "52px",
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "600",
        color: isDark ? "rgb(212 212 216)" : "rgb(55 65 81)",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        backgroundColor: isDark ? "rgb(24 24 27)" : "white",
        borderBottomColor: isDark ? "rgb(39 39 42)" : "rgb(243 244 246)",
        minHeight: "60px",
      },
      highlightOnHoverStyle: {
        backgroundColor: isDark ? "rgb(39 39 42)" : "rgb(249 250 251)",
        cursor: "pointer",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        color: isDark ? "rgb(212 212 216)" : "rgb(17 24 39)",
      },
    },
    pagination: {
      style: {
        backgroundColor: isDark ? "rgb(24 24 27)" : "white",
        borderTopColor: isDark ? "rgb(63 63 70)" : "rgb(229 231 235)",
        color: isDark ? "rgb(212 212 216)" : "rgb(17 24 39)",
      },
      pageButtonsStyle: {
        fill: isDark ? "rgb(212 212 216)" : "rgb(107 114 128)",
        "&:hover": {
          backgroundColor: isDark ? "rgb(39 39 42)" : "rgb(243 244 246)",
        },
      },
    },
  };

  if (!isOrgAdmin) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <Card className="max-w-md">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
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
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <Card className="bg-[#F1F5F9] border-transparent dark:bg-gray-900 dark:border-zinc-100 shadow-lg">
        <CardHeader>
          
          <div className="flex gap-6 mt-4 items-center">
          {/* Search Bar */}
            <div className=" relative w-full sm:w-64">
              <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`} />
              <Input
                type="text"
                placeholder={t.placeholders.searchUsers}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700`}
              />
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <UserPlus className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
              {t.actions.addUser}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 dark:text-zinc-400">
                {t.messages.noUsers}
              </p>
            </div>
          ) : (
            <DataTable
              columns={userColumns}
              data={filteredUsers}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30, 50]}
              highlightOnHover
              pointerOnHover
              customStyles={customStyles}
              noDataComponent={
                <div className="py-12 text-center text-gray-500 dark:text-zinc-400">
                  {searchTerm ? t.messages.noMatchingUsers : t.messages.noUsers}
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
        orgId={user?.org_id || ""}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="dark:bg-zinc-900 bg-white dark:border-zinc-800" dir={isRtl ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{t.titles.deleteUser}</DialogTitle>
            <DialogDescription>
              {t.messages.deleteConfirmation} <strong>{userToDelete?.name}</strong>? {t.messages.deleteWarning}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)} 
              disabled={deleteUserMutation.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'} animate-spin`} />
                  {t.messages.deleting}
                </>
              ) : (
                t.actions.delete
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
