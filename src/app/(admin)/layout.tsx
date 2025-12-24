"use client";

import { SessionProvider } from "next-auth/react";
import { Column } from "@once-ui-system/core";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Column
        fillWidth
        background="page"
        style={{ minHeight: "100vh" }}
        padding="l"
      >
        {children}
      </Column>
    </SessionProvider>
  );
}
