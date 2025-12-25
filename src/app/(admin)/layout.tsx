"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/admin/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/admin/ui/separator";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
      <SessionProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm text-muted-foreground">Admin</span>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
      </body>
      </html>
  );
}
