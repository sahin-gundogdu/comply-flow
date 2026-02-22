"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // --- State for Settings ---

  // 1. General Settings
  const [generalSettings, setGeneralSettings] = useState({
    maxFileSize: 25,
    emailNotifications: true,
    systemAlerts: true,
  });

  // 2. Task Definitions
  const [taskTypes, setTaskTypes] = useState([
    "Sözleşme",
    "Personel",
    "KVKK",
    "Proje",
  ]);
  const [newTaskType, setNewTaskType] = useState("");

  const priorityLevels = [
    { name: "Kritik", color: "bg-red-900" },
    { name: "Yüksek", color: "bg-red-600" },
    { name: "Orta", color: "bg-yellow-500" },
    { name: "Düşük", color: "bg-blue-500" },
  ];

  // 3. Notification Rules
  const [notificationRules, setNotificationRules] = useState({
    firstReminderPercent: 50,
    finalReminderDays: 1,
    emailTemplate: "Merhaba,\n\nYeni bir görev atandı: {{task_title}}.\n\nDetaylar için sisteme giriş yapınız.",
  });

  // 4. Team & Permissions
  const [groups, setGroups] = useState(["Uyum", "KVKK"]);
  const [newGroup, setNewGroup] = useState("");
  const roles = ["Admin", "User"]; // Read-only for now

  // --- Handlers ---

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Settings Saved:", {
        general: generalSettings,
        taskTypes,
        notificationRules,
        groups,
      });
      toast({
        title: "Başarılı",
        description: "Ayarlar başarıyla güncellendi.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const addTaskType = () => {
    if (newTaskType.trim() && !taskTypes.includes(newTaskType.trim())) {
      setTaskTypes([...taskTypes, newTaskType.trim()]);
      setNewTaskType("");
    }
  };

  const removeTaskType = (type: string) => {
    setTaskTypes(taskTypes.filter((t) => t !== type));
  };

  const addGroup = () => {
    if (newGroup.trim() && !groups.includes(newGroup.trim())) {
        setGroups([...groups, newGroup.trim()]);
        setNewGroup("");
    }
  }

   const removeGroup = (group: string) => {
    setGroups(groups.filter((g) => g !== group));
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ayarlar</h3>
        <p className="text-sm text-muted-foreground">
          Sistem yapılandırması ve tercihlerini buradan yönetebilirsiniz.
        </p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="definitions">Görev Tanımları</TabsTrigger>
          <TabsTrigger value="notifications">Hatırlatma Kuralları</TabsTrigger>
          <TabsTrigger value="team">Ekip ve Yetkilendirme</TabsTrigger>
        </TabsList>

        {/* 1. General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
              <CardDescription>
                Dosya yönetimi ve bildirim tercihlerini yapılandırın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="maxFileSize">Maksimum Dosya Boyutu (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={generalSettings.maxFileSize}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      maxFileSize: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">E-posta Bildirimleri</Label>
                  <CardDescription>
                    Yeni görevler ve güncellemeler için e-posta al.
                  </CardDescription>
                </div>
                <Switch
                  checked={generalSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setGeneralSettings({
                      ...generalSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Sistem İçi Uyarılar</Label>
                  <CardDescription>
                    Panel içi anlık bildirimleri etkinleştir.
                  </CardDescription>
                </div>
                <Switch
                   checked={generalSettings.systemAlerts}
                   onCheckedChange={(checked) =>
                     setGeneralSettings({
                       ...generalSettings,
                       systemAlerts: checked,
                     })
                   }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 2. Task Definitions */}
        <TabsContent value="definitions">
          <Card>
            <CardHeader>
              <CardTitle>Görev Tanımları</CardTitle>
              <CardDescription>
                Görev kategorilerini ve öncelik seviyelerini yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Görev Türleri</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Yeni tür ekle..."
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addTaskType();
                        }
                    }}
                  />
                  <Button onClick={addTaskType} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {taskTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80">
                      {type}
                      <button
                        onClick={() => removeTaskType(type)}
                        className="ml-2 hover:text-destructive focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Öncelik Seviyeleri (Sabit)</Label>
                <div className="space-y-2">
                    {priorityLevels.map((priority) => (
                        <div key={priority.name} className="flex items-center justify-between rounded-md border p-2">
                            <span className="font-medium">{priority.name}</span>
                            <div className={`h-4 w-4 rounded-full ${priority.color}`} />
                        </div>
                    ))}
                </div>
              </div>
            </CardContent>
             <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 3. Notification Rules */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Hatırlatma Kuralları</CardTitle>
              <CardDescription>
                Otomatik hatırlatma sıklığını ve şablonları ayarlayın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label htmlFor="firstReminder">İlk Hatırlatma (% Süre)</Label>
                   <Input 
                        id="firstReminder" 
                        type="number" 
                        min="1" 
                        max="100"
                        value={notificationRules.firstReminderPercent}
                        onChange={(e) => setNotificationRules({...notificationRules, firstReminderPercent: parseInt(e.target.value) || 0})}
                   />
                   <p className="text-[0.8rem] text-muted-foreground">
                        Toplam sürenin %{notificationRules.firstReminderPercent}'i dolduğunda.
                   </p>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="finalReminder">Son Hatırlatma (Gün)</Label>
                   <Input 
                        id="finalReminder" 
                        type="number" 
                        min="1" 
                        value={notificationRules.finalReminderDays}
                        onChange={(e) => setNotificationRules({...notificationRules, finalReminderDays: parseInt(e.target.value) || 0})}
                   />
                   <p className="text-[0.8rem] text-muted-foreground">
                        Son tarihe {notificationRules.finalReminderDays} gün kala.
                   </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailTemplate">Yeni Görev E-posta Şablonu</Label>
                <Textarea 
                    id="emailTemplate" 
                    className="min-h-[100px]"
                    value={notificationRules.emailTemplate}
                    onChange={(e) => setNotificationRules({...notificationRules, emailTemplate: e.target.value})}
                />
              </div>
            </CardContent>
             <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 4. Team & Permissions */}
        <TabsContent value="team">
           <Card>
            <CardHeader>
              <CardTitle>Ekip ve Yetkilendirme</CardTitle>
              <CardDescription>
                Kullanıcı gruplarını ve rollerini yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label>Gruplar</Label>
                     <div className="flex gap-2">
                        <Input
                            placeholder="Yeni grup ekle..."
                            value={newGroup}
                            onChange={(e) => setNewGroup(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addGroup();
                                }
                            }}
                        />
                        <Button onClick={addGroup} size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {groups.map((group) => (
                             <div key={group} className="flex items-center justify-between rounded-md border p-3">
                                <span className="font-medium">{group}</span>
                                 <Button variant="ghost" size="sm" onClick={() => removeGroup(group)}>
                                    <X className="h-4 w-4" />
                                 </Button>
                             </div>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label>Roller</Label>
                    <div className="grid grid-cols-2 gap-2">
                         {roles.map((role) => (
                             <div key={role} className="flex items-center justify-center rounded-md border p-3 bg-muted/50">
                                <span className="font-medium">{role}</span>
                             </div>
                        ))}
                    </div>
                 </div>
            </CardContent>
             <CardFooter>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
