"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const error = searchParams.get("error");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "24rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Admin Login
        </h1>
        <p style={{ color: "#666", margin: 0 }}>
          Sign in with your authorized Google account to access the admin
          dashboard.
        </p>

        {error && (
          <p style={{ color: "#dc2626", margin: 0, fontSize: "0.875rem" }}>
            {error === "AccessDenied"
              ? "Access denied. Your Google account is not authorized."
              : "An error occurred during sign in. Please try again."}
          </p>
        )}

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <span>Loading...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
