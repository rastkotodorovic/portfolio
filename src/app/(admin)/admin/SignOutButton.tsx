"use client";

import { signOut } from "next-auth/react";
import { Button } from "@once-ui-system/core";

export function SignOutButton() {
  return (
    <Button
      variant="secondary"
      size="s"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      Sign out
    </Button>
  );
}
