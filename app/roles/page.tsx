"use client";

import { useEffect, useState } from "react";
import { Role } from "@/types";
import { fetchRoles, deleteRole } from "@/lib/api";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleForm } from "@/components/roles/RoleForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { toast } = useToast();

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error("Roles fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleOpenCreateForm = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (!window.confirm(`"${role.name}" rolünü silmek istediğinize emin misiniz?`)) return;

    try {
      await deleteRole(role.id);
      toast({ title: "Başarılı", description: "Rol başarıyla silindi." });
      loadRoles();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Roller Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Roller</h1>
        <Button onClick={handleOpenCreateForm} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Rol Ekle
        </Button>
      </div>
      
      <div className="rounded-md border bg-white dark:bg-slate-950 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Rol Adı</TableHead>
              <TableHead className="text-right">Aksiyonlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Henüz kayıtlı rol bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
                roles.map((role) => (
                    <TableRow key={role.id}>
                    <TableCell className="font-medium text-muted-foreground">#{role.id}</TableCell>
                    <TableCell className="font-semibold">
                         <Badge variant={role.name === 'Admin' || role.name === 'Yönetici' ? 'default' : 'secondary'}>
                            {role.name}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEditForm(role)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Düzenle
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteRole(role)}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Sil
                            </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))
            )}
            
          </TableBody>
        </Table>
      </div>

      {isFormOpen && (
          <RoleForm 
            open={isFormOpen} 
            onOpenChange={setIsFormOpen} 
            role={editingRole} 
            onSuccess={loadRoles} 
          />
      )}
    </div>
  );
}
