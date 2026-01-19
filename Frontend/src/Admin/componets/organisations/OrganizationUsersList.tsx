import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";
import { TRANSLATIONS } from "./constants";
import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/utils/api";
import {
  Trash2,
  Users,
  UserCircle,
  AtSign,
  Loader2,
} from "lucide-react";

interface User {
  org_user_id?: string;
  user_id?: string;
  name?: string;
  username?: string;
  email: string;
  type?: string;
  status: string;
  picture?: string;
}

interface OrganizationUsersListProps {
  organizationId: string | undefined;
  users: User[];
  isLoading?: boolean;
}

export default function OrganizationUsersList({
  organizationId,
  users,
  isLoading = false,
}: OrganizationUsersListProps) {
  const queryClient = useQueryClient();
  const { language, theme } = useAppSelector((state) => state.settings);
  const t = TRANSLATIONS[language];
  const isDark = theme === "dark";

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await api.delete(
        `/organization/${organizationId}/users/${userId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-users", organizationId],
      });
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to delete user");
    },
  });

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    deleteUserMutation.mutate(userId);
  };

  const userColumns = [
    {
      name: t.fields.logo,
      cell: (row: User) => (
        <div className="flex items-center justify-center w-10 h-10">
          {row.picture ? (
            <img
              src={row.picture}
              alt={row.name || row.username}
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
      name: t.fields.name_en,
      selector: (row: User) => row.name || row.username || "",
      sortable: true,
      cell: (row: User) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.name || row.username}
        </div>
      ),
    },
    {
      name: t.fields.email,
      selector: (row: User) => row.email,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <AtSign className="w-4 h-4" />
          {row.email}
        </div>
      ),
    },
    {
      name: t.fields.type,
      selector: (row: User) => row.type || "User",
      sortable: true,
      cell: (row: User) => (
        <Badge variant="outline" className="dark:border-zinc-700">
          {row.type || "User"}
        </Badge>
      ),
    },
    {
      name: t.fields.status,
      cell: (row: User) => (
        <Badge
          variant={row.status === "active" ? "default" : "secondary"}
          className={
            row.status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      name: "",
      cell: (row: User) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDeleteUser(row.org_user_id || row.user_id || "")}
          disabled={deleteUserMutation.isPending}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50"
        >
          {deleteUserMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      ),
      width: "80px",
    },
  ];

  return (
    <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Users className="w-5 h-5 text-blue-600" />
            {t.titles.users}
            <Badge variant="secondary" className="dark:bg-zinc-800 dark:text-gray-300">
              {users.length}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <DataTable
            columns={userColumns}
            data={users}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            highlightOnHover
            pointerOnHover
            responsive
            customStyles={{
              table: {
                style: {
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                },
              },
              headRow: {
                style: {
                  backgroundColor: isDark ? "#27272a" : "#f9fafb",
                  borderBottom: isDark
                    ? "1px solid #3f3f46"
                    : "1px solid #e5e7eb",
                  minHeight: "52px",
                },
              },
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "600",
                  color: isDark ? "#f4f4f5" : "#111827",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                },
              },
              rows: {
                style: {
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                  borderBottom: isDark ? "1px solid #27272a" : "1px solid #f3f4f6",
                  minHeight: "60px",
                },
                highlightOnHoverStyle: {
                backgroundColor: isDark ? "rgb(39 39 42)" : "rgb(249 250 251)",
                cursor: "pointer",
              },
              },
              cells: {
                style: {
                  fontSize: "14px",
                  color: isDark ? "#d4d4d8" : "#374151",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                },
              },
              pagination: {
                style: {
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                  borderTop: isDark ? "1px solid #3f3f46" : "1px solid #e5e7eb",
                  color: isDark ? "#d4d4d8" : "#374151",
                },
                pageButtonsStyle: {
                  backgroundColor: "transparent",
                  color: isDark ? "#d4d4d8" : "#374151",
                  "&:hover": {
                    backgroundColor: isDark ? "#27272a" : "#f3f4f6",
                  },
                  "&:disabled": {
                    color: isDark ? "#52525b" : "#9ca3af",
                  },
                },
              },
            }}
            noDataComponent={
              <div className="py-12  text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  No users found for this organization.
                </p>
              </div>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
