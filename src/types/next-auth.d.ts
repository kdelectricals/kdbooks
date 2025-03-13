import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the User type
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    role: string;
    phone?: string;
    address?: string;
    profilePicture?: string;
  }

  interface Session extends DefaultSession {
    user: User;
    
  }

  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    role: string;
    phone?: string;
    address?: string;
    profilePicture?: string;
  }
}
