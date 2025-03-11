import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { setCookie } from "cookies-next";

// Mock user database (Replace with real DB check)
const users = [
  { id: "1", email: "vzade1999@gmail.com", password: "Shree@123", role: "admin" },
  { id: "2", email: "user@example.com", password: "$2a$10$uD....", role: "user" },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = users.find(u => u.email === credentials?.email);
        if (!user) throw new Error("User not found");

    
        if(credentials?.password !== user.password){
         throw new Error("Invalid credentials");
        }
        

        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 1800 }, // Auto-logout after 30 minutes
  pages: {
    signIn: "/login",
  },
});
