import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hukuk & Uyumluluk Görev Yönetim Sistemi",
  description: "Hukuk ve uyumluluk ekipleri için kapsamlı görev yönetim sistemi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <AuthGuard>
          <AppLayout>
            {children}
          </AppLayout>
        </AuthGuard>
        <Toaster />
      </body>
    </html>
  );
}
