import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"add" | "remove" | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Get all users from auth
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combine data
      const usersWithRoles = authData.users.map((user) => ({
        id: user.id,
        email: user.email || "No email",
        created_at: user.created_at,
        is_admin: roles?.some((r) => r.user_id === user.id && r.role === "admin") || false,
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !actionType) return;

    try {
      if (actionType === "add") {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: selectedUser.id, role: "admin" });

        if (error) throw error;
        toast.success("User promoted to admin");
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", selectedUser.id)
          .eq("role", "admin");

        if (error) throw error;
        toast.success("Admin role removed");
      }

      fetchUsers();
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const openDialog = (user: User, type: "add" | "remove") => {
    setSelectedUser(user);
    setActionType(type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold ${
                        user.is_admin
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.is_admin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.is_admin ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDialog(user, "remove")}
                      >
                        Remove Admin
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openDialog(user, "add")}
                      >
                        Make Admin
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "add" ? "Promote to Admin" : "Remove Admin Role"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "add"
                ? `Are you sure you want to promote ${selectedUser?.email} to admin? They will have full access to the admin dashboard.`
                : `Are you sure you want to remove admin role from ${selectedUser?.email}? They will lose access to the admin dashboard.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
