"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  FileText,
  ShieldCheck,
  Users,
  Key,
  Briefcase,
  KanbanSquare,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Gösterge Paneli",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Görevler",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Raporlar",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Kullanıcılar",
    href: "/users",
    icon: Users,
  },
  {
    title: "Roller",
    href: "/roles",
    icon: Key,
  },
  {
    title: "Gruplar",
    href: "/groups",
    icon: Briefcase,
  },
  {
    title: "Kanban Panom",
    href: "/kanban",
    icon: KanbanSquare,
  },
  {
    title: "Ayarlar",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-6 w-6" />
          <span>ComplyFlow</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
