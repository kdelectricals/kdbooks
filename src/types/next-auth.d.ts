import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string | unknown;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    role: string;
  }
}
