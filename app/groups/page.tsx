"use client";

import { useEffect, useState } from "react";
import { Group } from "@/types";
import { fetchGroups, deleteGroup } from "@/lib/api";
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
import { GroupForm } from "@/components/groups/GroupForm";
import { useToast } from "@/hooks/use-toast";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const { toast } = useToast();

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      console.error("Groups fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleOpenCreateForm = () => {
    setEditingGroup(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (group: Group) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleDeleteGroup = async (group: Group) => {
    if (!window.confirm(`"${group.name}" grubunu silmek istediğinize emin misiniz?`)) return;

    try {
      await deleteGroup(group.id);
      toast({ title: "Başarılı", description: "Grup başarıyla silindi." });
      loadGroups();
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
        <p className="text-muted-foreground">Gruplar Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gruplar</h1>
        <Button onClick={handleOpenCreateForm} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Grup Ekle
        </Button>
      </div>
      
      <div className="rounded-md border bg-white dark:bg-slate-950 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Grup Adı</TableHead>
              <TableHead className="text-right">Aksiyonlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Henüz kayıtlı grup bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
                groups.map((group) => (
                    <TableRow key={group.id}>
                    <TableCell className="font-medium text-muted-foreground">#{group.id}</TableCell>
                    <TableCell className="font-semibold">{group.name}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEditForm(group)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Düzenle
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteGroup(group)}>
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
          <GroupForm 
            open={isFormOpen} 
            onOpenChange={setIsFormOpen} 
            group={editingGroup} 
            onSuccess={loadGroups} 
          />
      )}
    </div>
  );
}
