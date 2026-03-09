import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config — no Prisma, no Node.js-only imports.
// Used by middleware to validate JWT sessions without hitting the database.
export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
