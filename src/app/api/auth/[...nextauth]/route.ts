import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Allowed admin emails from environment variable (comma-separated)
const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map((email) =>
  email.trim().toLowerCase()
) || [];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Only allow Google provider
      if (account?.provider !== "google") {
        return false;
      }

      // Check if email is verified and in the allowed list
      const googleProfile = profile as { email_verified?: boolean; email?: string };
      if (!googleProfile?.email_verified) {
        return false;
      }

      const email = googleProfile.email?.toLowerCase();
      if (!email || !allowedEmails.includes(email)) {
        return false;
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
