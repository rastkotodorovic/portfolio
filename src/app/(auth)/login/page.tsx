"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Skeleton } from "@/components/admin/ui/skeleton";

function LoginFormFallback() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Skeleton className="h-[280px] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </div>
          Magic Portfolio
        </a>
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
