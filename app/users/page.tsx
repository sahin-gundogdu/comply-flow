"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { fetchUsers, deleteUser } from "@/lib/api";
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
import { UserForm } from "@/components/users/UserForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Users fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreateForm = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`"${user.fullName}" kullanıcısını silmek istediğinize emin misiniz?`)) return;

    try {
      await deleteUser(user.id);
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla silindi." });
      loadUsers();
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
        <p className="text-muted-foreground">Kullanıcılar Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
        <Button onClick={handleOpenCreateForm} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı Ekle
        </Button>
      </div>
      
      <div className="rounded-md border bg-white dark:bg-slate-950 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Kullanıcı Adı</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Aksiyonlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Henüz kayıtlı kullanıcı bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
                users.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium text-muted-foreground">#{user.id}</TableCell>
                    <TableCell className="font-semibold">{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                            {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEditForm(user)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Düzenle
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)}>
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
          <UserForm 
            open={isFormOpen} 
            onOpenChange={setIsFormOpen} 
            user={editingUser} 
            onSuccess={loadUsers} 
          />
      )}
    </div>
  );
}
