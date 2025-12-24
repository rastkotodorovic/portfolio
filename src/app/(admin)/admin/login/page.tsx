"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Column, Button, Heading, Text } from "@once-ui-system/core";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const error = searchParams.get("error");

  return (
    <Column
      fillWidth
      horizontal="center"
      vertical="center"
      gap="l"
      style={{ minHeight: "100vh" }}
    >
      <Column horizontal="center" gap="m" maxWidth="s">
        <Heading variant="heading-strong-xl">Admin Login</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak" align="center">
          Sign in with your authorized Google account to access the admin dashboard.
        </Text>

        {error && (
          <Text variant="body-default-s" onBackground="danger-weak" align="center">
            {error === "AccessDenied"
              ? "Access denied. Your Google account is not authorized."
              : "An error occurred during sign in. Please try again."}
          </Text>
        )}

        <Button
          variant="primary"
          size="l"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Sign in with Google
        </Button>
      </Column>
    </Column>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <Column
          fillWidth
          horizontal="center"
          vertical="center"
          style={{ minHeight: "100vh" }}
        >
          <Text>Loading...</Text>
        </Column>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
